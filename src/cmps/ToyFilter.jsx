import { useState, useEffect, useRef } from 'react'

import { utilService } from "../services/util.service.js"
import { toyService } from "../services/toy.service.js"
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'

const FilterSchema = Yup.object().shape({
    txt: Yup.string()
        .matches(/^[^<>%$]*$/, 'Search text contains invalid characters'),
})

export function ToyFilter({ filterBy, onSetFilter }) {

    const [filterByToEdit, setFilterByToEdit] = useState({ ...filterBy })
    onSetFilter = useRef(utilService.debounce(onSetFilter, 300))
    const labels = toyService.getLabels()

    useEffect(() => {
        onSetFilter.current(filterByToEdit)
    }, [filterByToEdit])

    function handleFormikChange(values) {
        setFilterByToEdit(prevFilter => ({
            ...prevFilter,
            txt: values.txt
        }))
    }

    function handleInStockChange(e) {
        const value = e.target.value
        let inStock

        if (value === 'all') {
            inStock = undefined
        } else if (value === 'inStock') {
            inStock = true
        } else if (value === 'outOfStock') {
            inStock = false
        }

        setFilterByToEdit(prevFilter => ({ ...prevFilter, inStock }))
    }

    function handleLabelChange(e) {
        const { value, checked } = e.target

        setFilterByToEdit(prevFilter => {
            const updatedLabels = [...(prevFilter.labels || [])]

            if (checked && !updatedLabels.includes(value)) {
                updatedLabels.push(value)
            } else if (!checked && updatedLabels.includes(value)) {
                const idx = updatedLabels.indexOf(value)
                updatedLabels.splice(idx, 1)
            }

            return { ...prevFilter, labels: updatedLabels }
        })
    }

    return (
        <section className="toy-filter full main-layout">
            <h2>Toys Filter</h2>
            <Formik
                initialValues={{ txt: filterByToEdit.txt || '' }}
                validationSchema={FilterSchema}
                enableReinitialize={true}
                onSubmit={(values) => {
                }}
            >
                {({ values, handleChange, errors, touched }) => (
                    <Form>
                        <div>
                            <label htmlFor="txt">Name:</label>
                            <Field
                                type="text"
                                id="txt"
                                name="txt"
                                placeholder="By name"
                                onChange={(e) => {
                                    handleChange(e)
                                    handleFormikChange({ ...values, txt: e.target.value })
                                }}
                            />
                            <ErrorMessage name="txt" component="div" className="error-message" />
                        </div>

                        <label htmlFor="stock-status">Stock status:</label>
                        <select
                            id="stock-status"
                            value={filterByToEdit.inStock === undefined ? 'all' :
                                filterByToEdit.inStock ? 'inStock' : 'outOfStock'}
                            onChange={handleInStockChange}>
                            <option value="all">All</option>
                            <option value="inStock">In Stock</option>
                            <option value="outOfStock">Out of Stock</option>
                        </select>

                        <label>Labels:</label>
                        <div className="labels-container">
                            {labels.map(label => (
                                <div key={label} className="label-checkbox">
                                    <input
                                        type="checkbox"
                                        id={`label-${label}`}
                                        value={label}
                                        checked={filterByToEdit.labels?.includes(label) || false}
                                        onChange={handleLabelChange}
                                    />
                                    <label htmlFor={`label-${label}`}>{label}</label>
                                </div>
                            ))}
                        </div>

                        <label htmlFor="sortBy">Sort By:</label>
                        <select
                            id="sortBy"
                            name="sortBy"
                            value={filterByToEdit.sortBy || 'name'}
                            onChange={(e) => {
                                const { value, name } = e.target
                                setFilterByToEdit(prevFilter => ({ ...prevFilter, [name]: value }))
                            }}>
                            <option value="name">Name</option>
                            <option value="price">Price</option>
                            <option value="created">Created</option>
                        </select>
                    </Form>
                )}
            </Formik>
        </section>
    )
}