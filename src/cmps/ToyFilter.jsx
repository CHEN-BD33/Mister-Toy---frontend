import { useState, useEffect, useRef } from 'react'

import { utilService } from "../services/util.service.js"
import { toyService } from "../services/toy.service.local.js"

export function ToyFilter({ filterBy, onSetFilter }) {

    const [filterByToEdit, setFilterByToEdit] = useState({ ...filterBy })
    onSetFilter = useRef(utilService.debounce(onSetFilter, 300))
    const labels = toyService.getLabels()

    useEffect(() => {
        onSetFilter.current(filterByToEdit)
    }, [filterByToEdit])

    function handleChange({ target }) {
        let { value, name: field, type } = target
        value = type === 'number' ? +value : value
        setFilterByToEdit((prevFilter) => ({ ...prevFilter, [field]: value }))
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
            <form >
                <label htmlFor="name">Name:</label>
                <input type="text"
                    id="name"
                    name="txt"
                    placeholder="By name"
                    value={filterByToEdit.txt}
                    onChange={handleChange}
                />

                <label htmlFor="stock-status">Stock status:</label>
                <select
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
                                checked={filterByToEdit.labels.includes(label) || false}
                                onChange={handleLabelChange}
                            />
                            <label htmlFor={`label-${label}`}>{label}</label>
                        </div>
                    ))}
                </div>

                <label>Sort By:</label>
                <select
                    name="sortBy"
                    value={filterByToEdit.sortBy || 'name'}
                    onChange={handleChange}>
                    <option value="name">Name</option>
                    <option value="price">Price</option>
                    <option value="created">Created</option>
                </select>
            </form>
        </section>
    )
}