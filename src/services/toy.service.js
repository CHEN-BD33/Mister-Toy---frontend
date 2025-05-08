import { utilService } from './util.service.js'
import { httpService } from './http.service.js'

const BASE_URL = 'toy/'
const labels = ['On wheels', 'Box game', 'Art', 'Baby', 'Doll', 'Puzzle', 'Outdoor', 'Battery Powered']

export const toyService = {
    query,
    getById,
    save,
    remove,
    getEmptyToy,
    getDefaultFilter,
    getLabels,
    getPriceStats,
    getInventoryByLabel
}

async function query(filterBy = {}) {
    try {
        const toys = await httpService.get(BASE_URL, filterBy)
        return toys
    } catch (err) {
        loggerService.error('Failed to query toys', err)
        throw new Error('Cannot fetch toys')
    }
}


async function getById(toyId) {
    try {
        if (!toyId || typeof toyId !== 'string') {
            throw new Error('Invalid toy ID')
        }
        const toy = await httpService.get(BASE_URL + toyId)
        return toy
    } catch (err) {
        loggerService.error(`Failed to get toy with ID: ${toyId}`, err)
        throw new Error('Cannot fetch toy')
    }
}

async function remove(toyId) {
    try {
        if (!toyId || typeof toyId !== 'string') {
            throw new Error('Invalid toy ID')
        }
        await httpService.delete(BASE_URL + toyId)
    } catch (err) {
        loggerService.error(`Failed to remove toy with ID: ${toyId}`, err)
        throw new Error('Cannot remove toy')
    }
}

async function save(toy) {
    try {
        if (!toy || typeof toy !== 'object') {
            throw new Error('Invalid toy data')
        }
        if (toy._id) {
            return await httpService.put(BASE_URL + toy._id, toy)
        } else {
            return await httpService.post(BASE_URL, toy)
        }
    } catch (err) {
        loggerService.error('Failed to save toy', err)
        throw new Error('Cannot save toy')
    }
}

function getEmptyToy() {
    return {
        name: '',
        price: '',
        labels: _getRandomLabels(),
        inStock: true,
    }
}


function _getRandomLabels() {
    const labelsCopy = [...labels]
    const randomLabels = []
    for (let i = 0; i < 2; i++) {
        const randomIdx = Math.floor(Math.random() * labelsCopy.length)
        randomLabels.push(labelsCopy.splice(randomIdx, 1)[0])
    }
    return randomLabels
}

function getDefaultFilter() {
    return { txt: '', maxPrice: '', inStock: undefined, labels: [], sortBy: 'name', sortDir: 1 }
}

async function getLabels() {
    try {
        return [...labels]
    } catch (err) {
        loggerService.error('Failed to get labels', err)
        throw new Error('Cannot fetch labels')
    }
}

async function getPriceStats() {
    try {
        const toys = await query()
        const priceByLabelMap = _getPriceByLabelMap(toys)
        const data = Object.keys(priceByLabelMap).map(label => ({
            title: label,
            value: Math.round(priceByLabelMap[label].total / priceByLabelMap[label].count)
        }))
        return data
    } catch (err) {
        console.error('Failed to get price stats:', err)
        throw err
    }
}


async function getInventoryByLabel() {
    try {
        const toys = await query()
        const countByLabelMap = _getCountByLabelMap(toys)
        const data = Object.keys(countByLabelMap)
            .map(label => ({
                title: label,
                value: Math.round((countByLabelMap[label].inStock / countByLabelMap[label].total) * 100)
            }))
        return data
    } catch (err) {
        console.error('Failed to get inventory by label:', err)
        throw err
    }
}

function _getPriceByLabelMap(toys) {
    const map = {}
    toys.forEach(toy => {
        if (!toy.labels) return
        toy.labels.forEach(label => {
            if (!map[label]) map[label] = { total: 0, count: 0 }
            map[label].total += toy.price
            map[label].count++
        })
    })
    return map
}


function _getCountByLabelMap(toys) {
    return toys.reduce((map, toy) => {
        if (!toy.labels) return map
        toy.labels.forEach(label => {
            if (!map[label]) map[label] = { total: 0, inStock: 0 }
            map[label].total++
            if (toy.inStock) map[label].inStock++
        })
        return map
    }, {})
}