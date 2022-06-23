const basic = async (data, page) => {
    try {
        
        const middleIndex = Math.ceil(data.length / 2);
        
        const firstHalf = data.splice(0, middleIndex);   
        const secondHalf = data.splice(-middleIndex);
        
        const result = []
        const arr1 = []
        const arr2 = []
        const ctrl = [{text: '←', callback_data: 'prev'},{text: '→', callback_data: 'next'}]
        
        for (const i of firstHalf) {
            arr1.push({
                text: i.login_name,
                callback_data: i.login_id
            })
        }
        
        
        for (const i of secondHalf) {
            arr2.push({
                text: i.login_name,
                callback_data: i.login_id
            })
        }
        
        result.push(arr1)
        result.push(arr2)
        console.log(data.length);
        result.push(ctrl)
        // if (condition) {
            
        // }
        // page === 1 ? ctrl.shift() : !(data.length) ? ctrl.pop() : ctrl

        return result
        
    } catch (error) {
        console.log(error.message, 'basic');
    }
}

module.exports = {
    basic
}