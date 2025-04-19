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
    getRandomToy,
    getLabels
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
        labels: [],
        inStock: true,
    }
}

function getRandomToy() {
       const randomLabels = []
       for (let i = 0; i < utilService.getRandomIntInclusive(1, 3); i++) {
           const randomLabel = labels[utilService.getRandomIntInclusive(0, labels.length - 1)]
           if (!randomLabels.includes(randomLabel)) randomLabels.push(randomLabel)
       }
   
       return {
           name: ['Fun Toy', 'Super Puzzle', 'Action Figure', 'Building Blocks', 'Remote toy', 'Talking Doll'][utilService.getRandomIntInclusive(0, 5)],
           price: utilService.getRandomIntInclusive(10, 200),
           labels: randomLabels,
           inStock: Math.random() > 0.3,
           imgUrl: '',
           createdAt: Date.now() - utilService.getRandomIntInclusive(0, 1000 * 60 * 60 * 24 * 30)
       }
}

function getDefaultFilter() {
    return { txt: '', maxPrice: '', inStock: undefined, labels: [], sortBy: 'name' }
}


function getLabels() {
    return [...labels]
}
