import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'

import { toyService } from '../services/toy.service.js'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'

import { ADD_TOY_TO_CART } from '../store/reducers/toy.reducer.js'
import { loadToys, removeToyOptimistic, saveToy, setFilterBy } from '../store/actions/toy.actions.js'

import { ToyFilter } from '../cmps/ToyFilter.jsx'
import { ToyList } from '../cmps/ToyList.jsx'
import { useEffectOnUpdate } from '../hooks/useEffectOnUpdate.js'
import { useOnlineStatus } from '../hooks/useOnlineStatus.js'

export function ToyIndex() {

    const dispatch = useDispatch()
    const toys = useSelector(storeState => storeState.toyModule.toys)
    const filterBy = useSelector(storeState => storeState.toyModule.filterBy)
    const isLoading = useSelector(storeState => storeState.toyModule.isLoading)

    const isOnline = useOnlineStatus()

    useEffect(() => {
        console.log(`status: ${isOnline ? 'online' : 'offline'}`)
    }, [isOnline])

    useEffectOnUpdate(() => {
        async function fetchToys() {
            try {
                await loadToys()
            } catch (err) {
                showErrorMsg('Cannot load toys!')
            }
        }
        fetchToys()
    }, [filterBy])

    async function onSetFilter(filterBy) {
        try {
            await setFilterBy(filterBy)
        } catch (err) {
            showErrorMsg('Cannot apply filter')
        }
    }

    async function onRemoveToy(toyId) {
        try {
            await removeToyOptimistic(toyId)
            showSuccessMsg('Toy removed')
        } catch (err) {
            showErrorMsg('Cannot remove Toy')
        }
    }

    async function onAddToy() {
        const toyToSave = toyService.getRandomToy()
        try {
            const savedToy = await saveToy(toyToSave)
            showSuccessMsg(`Toy added (id: ${savedToy._id})`)
        } catch (err) {
            showErrorMsg('Cannot add Toy')
        }
    }

    // async function onEditToy(toy) {
    //     const price = +prompt('New price?')
    //     const toyToSave = { ...toy, price }

    //     try {
    //         const savedToy = await saveToy(toyToSave)
    //         showSuccessMsg(`Toy updated to price: $${savedToy.price}`)
    //     } catch (err) {
    //         showErrorMsg('Cannot update Toy')
    //     }
    // }
    function addToCart(toy) {
        try {
            console.log(`Adding ${toy.name} to Cart`)
            dispatch({ type: ADD_TOY_TO_CART, toy })
            showSuccessMsg('Added to Cart')
        } catch (err) {
            showErrorMsg('Cannot add to cart')
        }
    }

    return (
        <div>
            <main>
                <Link to="/toy/edit">Add Toy</Link>
                <button className='add-btn' onClick={onAddToy}>Add Random Toy </button>
                <ToyFilter filterBy={filterBy} onSetFilter={onSetFilter} />
                {!isLoading
                    ? <ToyList
                        toys={toys}
                        onRemoveToy={onRemoveToy}
                        addToCart={addToCart}
                    />
                    : <div>Loading...</div>
                }
                <hr />
            </main>
        </div>
    )
}