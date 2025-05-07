import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'

import { toyService } from "../services/toy.service.js"
import { utilService } from '../services/util.service.js'

export function ToyDetails() {
    const [toy, setToy] = useState(null)
    const { toyId } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        if (toyId) loadToy()
    }, [toyId])

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

    if (!toy) return <div>Loading...</div>
    return (
        <section className="toy-details">
            <h1>Toy Name : {toy.name}</h1>
            <h5>Price: ${toy.price}</h5>
            <h5>labels: <span>{toy.labels && toy.labels.length ? toy.labels.join(', ') : 'None'}</span></h5>
            <h5> inStock: {toy.inStock ? 'Yes' : 'No'}</h5>
            <h5>Created: {utilService.formatDate(toy.createdAt)}</h5>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi voluptas cumque tempore, aperiam sed dolorum rem! Nemo quidem, placeat perferendis tempora aspernatur sit, explicabo veritatis corrupti perspiciatis repellat, enim quibusdam!</p>
            <Link to={`/toy/edit/${toy._id}`}>Edit</Link> &nbsp;
            <Link to={`/toy`}>Back</Link>
            {/* <p>
                <Link to="/toy/nJ5L4">Next Toy</Link>
            </p> */}
        </section>
    )
}