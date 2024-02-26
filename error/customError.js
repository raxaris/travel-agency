class CustomError extends Error {
    constructor(message, status) {
      super(message);
      this.status = status;
    }

    toJSON() {
        return {
            error: {
                message: this.message,
                status: this.status
            }
        };
    }
    
    static notFound(){
        return new CustomError(404,"Not Found")
    }
    static internalServerError(){
        return new CustomError(500,"Internal Server Error")
    }
    static forbidden(){
        return new CustomError(403,"Forbidden")
    }
    static unauthorized(){
        return new CustomError(401,"Unauthorized")
    }
  }

module.exports = CustomError