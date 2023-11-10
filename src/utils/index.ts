import { HttpException, HttpStatus } from '@nestjs/common';
const jwt = require('jsonwebtoken');
import * as argon from 'argon2';
import fs = require('fs');
import path = require('path');
var randomize = require('randomatic');



export const handleCustonCreateResponse = (data, msg) => {
    return {
      status_code: HttpStatus?.CREATED,
      data: data,
      message:msg,    };
  };

  

  export const handleSuccessRespone = (data, msg) => {
    // let _msg = msg;
    // msg = data?.message ? data?.message : _msg
    return {
       status_code: HttpStatus.OK,
      data: data,
      message: msg
    };
  };





  export const handleErrorRespone = (msg) => {
    return {
       status_code: HttpStatus.BAD_REQUEST,
      message: msg
    };
  };

  export const handleCreateSuccessRespone = (msg) => { 
    return {
      status_code: HttpStatus.CREATED,
      // data: data,
      message: msg 
    };
  };


  export const handleUpdateDeleteSuccessRespone = (msg:any) => { 
    return {
      status_code: HttpStatus.OK,
      message: msg    };
  };

  export const SuccessRespone = (data:any) => { 
    return {
      status_code: HttpStatus?.OK,
       message: data,
    };
  };


  export const handleEmailExistResponse = (msg:any) => {

    return {
      status_code: HttpStatus?.FORBIDDEN,
      failed: true,
      message: msg,    };
  };

  export const checkFileResponse = (msg) => {

    return {
      status_code: HttpStatus?.UNPROCESSABLE_ENTITY,
      failed: true,
      message: msg,    };
  };

  export const handleFailResponse = (msg) => {

    return {
      failed: true,
      status_code: HttpStatus?.UNPROCESSABLE_ENTITY,
      message: msg,    };
  };



  export const handleNotFoundResponse = () => {

    return {
      failed: true,
      status_code: HttpStatus.NOT_FOUND,
      message: "Object Not Found",    };
  };

  export const CustomhandleNotFoundResponse = (msg) => {

    return {
      failed: true,
      status_code: HttpStatus.NOT_FOUND,
      message:msg,    };
  };

  export const AccountNotAuthorizedResponse = (msg) => {

    return {
      failed: true,
      status_code: HttpStatus.UNAUTHORIZED,
      message:msg,    };
  };

  export const handleForbiddenExceptionResponses = (msg) => {
    return {
      failed: true,
      status_code: HttpStatus.FORBIDDEN,
      message:msg,    };
  }

  export const handleGrpcTryCatchError = (
    message = "There was an error processing your request"
  ) => {
    return {
      status_code: HttpStatus?.BAD_REQUEST,
      failed: true,
      message : message,
      // service_id: "PRODUCT_CATEGORY_SERVICE"
    };
  };
  
  export const handleGrpcReqError = (error) => {
    console.error(error);
  };
  
  export const userCreationNoRq = (user: any, id?: number) => {
    if (id) {
      return {
        user_updated_id: user.sub,
      };
    } else {
      return {
        user_created_id: user.sub,
        user_updated_id: user.sub,
      };
    }
  };



  
  export const buildUpdateModel = (oldModel, newData, model) => {
    if (!oldModel) {
      throw new Error(`${model.name} record not found`);
    }
    let modelObject = oldModel;
    for (const key in newData) {
      if (newData.hasOwnProperty(key)) {
        modelObject[key] = newData[key];
      }
    }
    return modelObject;
  };
  
  export const userCreation = (user: any, id?: number) => {
    if (id) {
      return {
        user_updated_id: user.sub,
        updatedAt: new Date()
      };
    } else {
      return {
        user_created_id: user.sub,
        user_updated_id: user.sub,
      };
    }
  };
  
  export const userUpdating = (user: any) => {
    return {
      user_updated_id: user.sub,
    };
  };
  
  export const handleTryCatchError = (error: any) => {
    error = error?.errors ? error.errors : error;
    let msg = parseSqlMsg(
      seqErrParser(error) ? seqErrParser(error).message : error?.message
    );
 
  };
  
  export const getTryCatchMsg = (error: any) => {
    console.log(error);
    error = error?.errors ? error.errors : error;
    return parseSqlMsg(
      seqErrParser(error) ? seqErrParser(error).message : error?.message
    );
  };
  

  
  let parseSqlMsg = (msg: any) => {
    let nMsg = msg;
    if (msg) {
      let part1 = msg.split("lower(");
      if (part1[1]) {
        let txtNew = part1[1].split("text)");
        let unquTxt = txtNew[1];
        let fieldName = txtNew[0].split("::")[0];
        if (fieldName) {
          nMsg = `${fieldName}${unquTxt}`;
        }
      }
    }
    nMsg = nMsg ? nMsg.split("_").join(" ") : nMsg;
    nMsg = nMsg
      ? nMsg.replace("must be unique", "already exists")
      : "Sorry, something went wrong";
    nMsg = nMsg.replace("cannot be null", "is required");
    nMsg = nMsg.replace(".", " ");
    return nMsg;
  };
  
  const seqErrParser = (errobjArr: any) => {
    let errorBag = [],
      field = null;
  
    if (errobjArr) {
      if (errobjArr.length) {
        // Filter to return one error at a time (first) error message
        errorBag = errobjArr
          .filter(function (errobj) {
            if (errobj.path === field) {
              return false;
            } //skip
            field = errobj.path;
            return true;
          })
          .map(function (errobj) {
            return {
              message: errobj.message,
              field: errobj.path,
              type: errobj.type,
              instance: errobj.instance,
            };
          });
      }
    }
    // Get all unique violation
    let errorBagFilted = errorBag.filter((eb) => eb.type == "unique violation");
    //
    let instance = errorBag[0]?.instance?.constructor?.name;
    // Check if all error bags are or type 'unique violation'
    if (errorBagFilted.length == errorBag.length && errorBag.length > 0) {
      let errBagFields = errorBag.map((ebg) => ebg.field);
      // Return structured a unique message with all fields
      return {
        ...errorBag[0],
        message: `A ${instance} ${errBagFields.join(
          " & "
        )} must be unique: [Instance: ${instance}]`,
      };
    }
    return errorBag[0];
  };
  
  
  export const checkRecordExists = async (Model: any, params = {}, msg = 'Record already exists: CODE EXT101') => {
    let record = await Model.findOne({
      where: {
        ...params
      }
    });
  
    if(record){
      throw new Error(msg)
    }
  }
  
  export const checkIfRecordNotFound = async (Model: any, params = {}, msg = 'Record already exists: CODE EXT101') => {
    let record = await Model.findOne({
      where: {
        ...params
      }
    });
  
    if(!record){
      throw new Error(msg)
    }
  }
  
  export const getPagination = (page, size) => {
    const limit = size ? +size : 10;
    const offset = page ? page * limit : 0;
    return { limit, offset };
  };
  
  export const Checknegative = (number) => {
    return !Object.is(Math.abs(number), + number)
  }


export const getPagingData = (data, page, limit) => {
  let { count: totalItems,rows: items } = data;
  const currentPage = page ? +page : 0;
  const totalPages = Math.ceil(totalItems / limit);
  items = items || [];

  return {
    items,
    currentPage,
    totalItems,
    totalPages
  };
};

export const formatDateToDDMMYYYY = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

  export const paginate = (query, schema) => {
    let page = query.page ? query.page - 1 : 0;
    page = page < 0 ? 0 : page;
    let limit = parseInt(query.limit || 10);
    limit = limit < 0 ? 10 : limit;
    const offset = page * limit;
    const where = {};
    // delete query.page;
    // delete query.limit;
    Object.keys(schema).forEach((key) => {
      schema[key] && query[key] ? (where[key] = query[key]) : null;
    });
    return {
      where: where,
      offset,
      limit,
    };
  };

  export const QryPaginateData = (items, totalItems,currentPage,limit) => {
   
    return {
      status_code: HttpStatus.OK,
      message: "success",
      'items' : items,
      'totalItems': totalItems,
      'currentPage' : Number(currentPage),
      'totalPages' :  Math.ceil(totalItems / limit),    }
  
  }
  
  
  
  export const mapPrmsToQuery = (query, where = true) => {
    let _cnt = 0;
    let _qCntrct = "";
    if (Object.keys(query).length) _qCntrct = where ? `WHERE ` : '';
    for (const param in query) {
      _cnt++;
      if (Object.hasOwnProperty.call(query, param)) {
        const _parm = query[param];
        if(Array.isArray(_parm)){
          if(_parm?.length){
            if (Object.keys(query).length == _cnt) {
              _qCntrct += `${param} IN (${_parm})`;
            } else {
              _qCntrct += `${param} IN (${_parm}) AND `;
            }
          }
        }else{
          if(_parm){
            if (Object.keys(query).length == _cnt) {
              _qCntrct += `${param} = '${_parm}'`;
            } else {
              _qCntrct += `${param} = '${_parm}' AND `;
            }
          }
        }
      }
    }
    return _qCntrct;
  };

  // export const updateEmail = (id, email) => {
  
  // };

  export const handleRequestError = (
    error,ErrorCode
  ) => {  
    throw new HttpException(
      {
        message: error,
        // status_code: ErrorCode,
        status_code: ErrorCode,
        failed: true,
      
      },
      ErrorCode,
    );
  };



  export const handleValidationResponse = (msg:any) => {

    return {
      status_code: HttpStatus?.UNPROCESSABLE_ENTITY,
      failed: true,
      message: msg,    };
  };


//   export const   generateToken = (
//     user: User,
//     signOptions: jwt.SignOptions = {},
//   ){
//     const payload = { sub: user.id, email: user.email, scopes: user.roles };
//     return {
//       accessToken: this.jwtService.sign(payload, signOptions),
//     };
//   }
// }


  export const  createToken = (organization_id:any ) => {
    return jwt.sign({organization_id}, process.env.JWT_SECRET, {expiresIn: '24h',algorithm: 'RS256'});
  };

  // const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });


  export const verifyUserToken = (token) =>{
  //  const decode = jwt.verify(token,process.env.JWT_PUBLIC_KEY)
  const decode = jwt.verify(token,process.env.JWT_SECRET)
   return decode;
 
 };

//  export const verifyOrganizationToken = (token) =>{
//   const decode = jwt.verify(token,process.env.JWT_PUBLIC_KEY);
//   return decode;

// };

 export const  reseetpassToken = (data)  => {
  let {email,userId } = data
   return jwt.sign({email,userId}, process.env.JWT_RESET_PASSWORD, {expiresIn: '1h'});
 };

 export const verifyToken = (token) =>{
   const decode = jwt.verify(token,process.env.JWT_RESET_PASSWORD);
   return decode;

};

export const  createAccessToken = ({id})  => {
  const decode= jwt.sign({organization_Id:id}, process.env.jWT_ACCESS_SECRET, {expiresIn: '30m'});
  return decode
};


 export const  generateRefreshToken = ({userId})  => {
  return jwt.sign({user_id : userId}, process.env.jWT_REFRESH_SECRET, {expiresIn: '30d'});
};


export const createEmailToken = (data) => {
  let {email,organizationId } = data
  return jwt.sign({email,organizationId}, process.env.JWT_EMAIL_TOKEN, {expiresIn: '1h'});
}

export const verifyEmailToken = (token) => {
  const decode = jwt.verify(token,process.env.JWT_EMAIL_TOKEN);
  return decode;
}

export const generateId =(pattern,length) => {
    return  randomize(pattern, length);
}


// export const destroyToken = (token) => {
//   return jwt.(token);
// }


