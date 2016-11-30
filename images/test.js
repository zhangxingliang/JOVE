function Vue(obj){
	obj.$store = obj.store,
	obj.components.forEach(item=>{
		item.$store = obj.store;
	})
	return obj;
}