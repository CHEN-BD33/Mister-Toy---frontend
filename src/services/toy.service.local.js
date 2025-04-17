import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'
import { userService} from './user.service.js'

const STORAGE_KEY = 'toyDB'
const labels = ['On wheels', 'Box game', 'Art', 'Baby', 'Doll', 'Puzzle', 'Outdoor', 'Battery Powered']
_createToys()

export const toyService = {
    query,
    getById,
    save,
    remove,
    getEmptyToy,
    getRandomToy,
    getDefaultFilter,
    getLabels
}

function query(filterBy = {}) {
    return storageService.query(STORAGE_KEY)
        .then(toys => {
            if (!filterBy.txt) filterBy.txt = ''
            if (!filterBy.maxPrice) filterBy.maxPrice = Infinity

            let filteredToys = toys

            if (filterBy.txt) {
                const regExp = new RegExp(filterBy.txt, 'i')
                filteredToys = filteredToys.filter(toy => regExp.test(toy.name))
            }

            if (filterBy.maxPrice !== Infinity) {
                filteredToys = filteredToys.filter(toy => toy.price <= filterBy.maxPrice)
            }

            if (filterBy.inStock !== undefined) {
                filteredToys = filteredToys.filter(toy => toy.inStock === filterBy.inStock)
            }

            if (filterBy.labels && filterBy.labels.length > 0) {
                filteredToys = filteredToys.filter(toy => {
                    return filterBy.labels.every(label => toy.labels.includes(label))
                })
            }

            if (filterBy.sortBy) {
                switch (filterBy.sortBy) {
                    case 'name':
                        filteredToys.sort((a, b) => a.name.localeCompare(b.name))
                        break
                    case 'price':
                        filteredToys.sort((a, b) => a.price - b.price)
                        break
                    case 'created':
                        filteredToys.sort((a, b) => a.createdAt - b.createdAt)
                        break
                }
            }
            return filteredToys
        })
}

function getById(toyId) {
    return storageService.get(STORAGE_KEY, toyId)
}

function remove(toyId) {
    return storageService.remove(STORAGE_KEY, toyId)
}

function save(toy) {
    if (toy._id) {
        return storageService.put(STORAGE_KEY, toy)
    } else {
        // when switching to backend - remove the next line
        toy.owner = userService.getLoggedinUser()
        toy.createdAt = Date.now()
        return storageService.post(STORAGE_KEY, toy)
    }
}

function getEmptyToy() {
    return {
        name: '',
        price: '',
        labels: [],
        inStock: true,
        imgUrl: 'https://via.placeholder.com/150'
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
        imgUrl: 'https://via.placeholder.com/150',
        createdAt: Date.now() - utilService.getRandomIntInclusive(0, 1000 * 60 * 60 * 24 * 30)
    }
}

function getDefaultFilter() {
    return { txt: '', maxPrice: '', inStock: undefined, labels: [], sortBy: 'name' }
}

function getLabels() {
    return [...labels]
}

function _createToys() {
    var toys = utilService.loadFromStorage(STORAGE_KEY)
    if (toys && toys.length > 0) return

    toys = []
    for (var i = 0; i < 12; i++) {
        const toy = getRandomToy()
        toy._id = utilService.makeId()
        toys.push(toy)
    }
    utilService.saveToStorage(STORAGE_KEY, toys)
}