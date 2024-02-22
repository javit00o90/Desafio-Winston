import {fakerEN_US as faker} from '@faker-js/faker'

export const productsGenerator=()=>{
    let title=faker.commerce.productName()
    let description=faker.commerce.productDescription()
    let price=faker.number.float({min:300, max:7600, fractionDigits: 2})
    let thumbnail= faker.image.dataUri({ width: 300, height: 250 })
    let code=faker.string.sample(6)
    let stock=faker.number.int({min:5, max:80 })
    let category=faker.commerce.department()
    let status=true

    return {
        title, description, thumbnail, price, code, stock, category, status
    }
}
