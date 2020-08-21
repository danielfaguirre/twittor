const actualizarcacheDinamico = (dynamicCache, req, res) =>{
    console.log("hello");
    if (res.ok) {
        return caches.open(dynamicCache)
            .then(cache=>{
                cache.put(req, res.clone());
                return res.clone();
            }); 
    }else{
        return res;
    }
};