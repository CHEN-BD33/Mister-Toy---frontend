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

function query(filterBy = {}) {
    return httpService.get(BASE_URL, filterBy)
}

function getById(toyId) {
    return httpService.get(BASE_URL + toyId)

}

function remove(toyId) {
    return httpService.delete(BASE_URL + toyId)
}

function save(toy) {
    if (toy._id) {
        return httpService.put(BASE_URL + toy._id, toy)
    } else {
        return httpService.post(BASE_URL, toy)
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


function getLabels() {
    return [...labels]
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