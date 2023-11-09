class ApiFeatures{
    constructor(query,queryStr){
        this.query=query;
        this.queryStr=queryStr
    }

    filter(){
        let queryObj = { ...this.queryStr };
        let excludeFields = ["sort", "page", "fields", "limit"];
        excludeFields.forEach((el) => {
          delete queryObj[el];
        });
        //filtering
        let queryString = JSON.stringify(queryObj);
        queryString = queryString.replace(
          /\b(gte|lte|lt|gt)\b/g,
          (match) => `$${match}`
        );
        queryObj = JSON.parse(queryString);
        // console.log(queryObj);
        this.query = this.query.find(queryObj);

        return this;
    }

    sort(){
        if (this.queryStr.sort) {
          const sortBy = this.queryStr.sort.split(",").join(" ");
          this.query = this.query.sort(sortBy);
          // 'price ratings'
        } else {
          this.query = this.query.sort("-createdAt");
        }
        return this;
    }

    limit(){
        if (this.queryStr.fields) {
          const fields = this.queryStr.fields.split(",").join(" ");
          this.query = this.query.select(fields);
        }
        return this;
    }

    paginate(){
        const page = this.queryStr.page * 1 || 1;
    const limit = this.queryStr.limit * 1 || 3;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);

    // if (req.query.page) {
    //   const movieCount = await Movie.countDocuments();
    //   if (skip >= movieCount) {
    //     throw Error("Page not found");
    //   }
    // }
    return this;
    }
}

module.exports=ApiFeatures;