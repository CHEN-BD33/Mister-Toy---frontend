import { Link } from 'react-router-dom'
import { useState } from 'react'

export function ToyPreview({ toy }) {
    const [isImgLoading, setImgLoading] = useState(true)
   
    function handleImageLoad() {
        setImgLoading(false)
    }

    return (
        <article>
            <h4>{toy.name}</h4>
            {isImgLoading && <div className="skeleton-loader"></div>}
                <div className="img-container">
                    <img
                        src={`https://robohash.org/${toy.name}?set=set4`}
                        alt={toy.name}
                        onLoad={handleImageLoad}
                        style={{ display: isImgLoading ? 'none' : 'block' }}
                    />
                </div>
            <p>Price: <span>${toy.price.toLocaleString()}</span></p>
            <p>inStock: {toy.inStock ? 'Yes' : 'No'} </p>
            {/* {toy.owner && <p>Owner: <Link to={`/user/${toy.owner._id}`}>{toy.owner.fullname}</Link></p>} */}
            <hr />
            <Link to={`/toy/edit/${toy._id}`}>Edit</Link> &nbsp; | &nbsp;
            <Link to={`/toy/${toy._id}`}>Details</Link>

        </article>
    )
}