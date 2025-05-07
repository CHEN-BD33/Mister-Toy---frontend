import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { toyService } from "../services/toy.service.js"
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js"
import { saveToy } from "../store/actions/toy.actions.js"
import { useConfirmTabClose } from '../hooks/useConfirmTabClose.js'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'

const ToySchema = Yup.object().shape({
    name: Yup.string()
        .min(2, 'Name must be at least 2 characters')
        .required('Name is required'),
    price: Yup.number()
        .positive('Price must be positive')
        .required('Price is required'),
})

export function ToyEdit() {
    const navigate = useNavigate()
    const [initialValues, setInitialValues] = useState(toyService.getEmptyToy())
    const { toyId } = useParams()

    const hasChanges = useRef(false)
    useConfirmTabClose(hasChanges)

    useEffect(() => {
        if (toyId) loadToy()
    }, [])

    async function loadToy() {
        try {
            const toy = await toyService.getById(toyId)
            setInitialValues(toy)
        } catch (err) {
            console.log('Had issues in toy edit', err)
            showErrorMsg('Cannot load toy')
            navigate('/toy')
        }
    }

    async function handleSubmit(values, { setSubmitting }) {
        try {
            if (!values.price) values.price = 1000
            await saveToy(values)
            showSuccessMsg('Toy Saved!')
            navigate('/toy')
        } catch (err) {
            console.log('Had issues in toy details', err)
            showErrorMsg('Cannot save toy')
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <section className="toy-edit">
            <h2>{initialValues._id ? 'Edit' : 'Add'} Toy</h2>

            <Formik
                enableReinitialize={true}
                initialValues={initialValues}
                validationSchema={ToySchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting, dirty }) => {
                    useEffect(() => {
                        hasChanges.current = dirty
                    }, [dirty])

                    return (
                        <Form className="toy-form">
                            <div className="form-group">
                                <label htmlFor="name">Name:</label>
                                <Field
                                    type="text"
                                    name="name"
                                    id="name"
                                    placeholder="Enter name..."
                                />
                                <ErrorMessage name="name" component="div" className="error-message" />
                            </div>

                            <div className="form-group">
                                <label htmlFor="price">Price:</label>
                                <Field
                                    type="number"
                                    name="price"
                                    id="price"
                                    placeholder="Enter price"
                                />
                                <ErrorMessage name="price" component="div" className="error-message" />
                            </div>

                            <div className="form-actions">
                                <button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? 'Saving...' : (initialValues._id ? 'Save' : 'Add')}
                                </button>
                                <Link to="/toy">Cancel</Link>
                            </div>
                        </Form>
                    )
                }}
            </Formik>
        </section>
    )
}