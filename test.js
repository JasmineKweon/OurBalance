function sumAll(...nums) {
    let total = 0;
    console.log(nums); //[{ price: 1 }, { price: 2 }]
    for (let n of nums) total += n.price;
    return total;
}

const result = sumAll({ price: 1 }, { price: 2 });
console.log(result);