class ApiFeatures{
    constructor(mongooseQuery, queryString){
        this.mongooseQuery = mongooseQuery ;
        this.queryString = queryString ;
    }
    filter(){
        exports.getProducts =  asyncHandler(async (req,res) =>{
          const queryStringObj = {...req.queryString} ;
          const exludedFields = ['page' , 'sort' , 'limit' , 'fields'] ;
          exludedFields.forEach((field) => delete queryStringObj[field]) ;
        
           let queryStr = JSON.stringify(queryStringObj) ;
           queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g , match => `$${match}`) ;
           
           this.mongooseQuery = this.mongooseQuery.find(JSON.parse(queryStr)) ;
           return this ;
        })
}

   sort(){
       if(req.queryString.sort){
      mongooseQuery = mongooseQuery.sort(req.query.sort.split(',').join(' ')) ;
   } else {
      this.mongooseQuery = this.mongooseQuery.sort('-createdAt') ;   
   }
   return this ;
   }

    limitFields(){
        
   if(req.queryString.fields){
      const fields = req.query.fields.split(',').join(' ') ;
      mongooseQuery = mongooseQuery.select(fields) ;

   } else {
      this.mongooseQuery = this.mongooseQuery.select('-__v') ;
   }
    return this ;
    }

    search(){
           // Searh 
   if(req.queryString.keyword){
      const keyword = req.query.keyword ;
     this.mongooseQuery = this.mongooseQuery.find({
         $or : [
            {title : {$regex : keyword , $options : 'i'}},
            {description : {$regex : keyword , $options : 'i'}}
         ]
      })
   }
    return this ;
    }

    paginate(){
   const page = req.query.page * 1 || 1 ;
   const limit = req.query.limit * 1 || 5 ;
   const skip = (page -1) * limit ;
   const endPage = page * limit ;

   // pagination result 
   const pagination = {} ;
    pagination.currentPage = page ;
    pagination.limit = limit ;
    pagination.numberOfPages = Math.ceil(this.totalDocuments / limit) ;

    if(endPage < this.totalDocuments){
        pagination.next = page + 1 ;
    }
    if(skip > 0){
        pagination.prev = page - 1 ;
    }
    this.paginationResult = pagination ;
    this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit) ;
   return this ;
    }
}

module.exports = ApiFeatures ;