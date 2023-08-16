
import * as argon from 'argon2';
export const createData = (model, newItem) => {

    const item = model.create(newItem);
    if (item) {
      return item;
  
    } else {
      return {};
    }
  
  }

  export const createDatawithTranz = (model, newItem,t) => {

    const item = model.create(newItem,t);
    if (item) {
      return item;
  
    } else {
      return {};
    }
  
  }

  
  
  
  
  export const updateData = (req, model, oldItem, where) => {
    if (req.id) {
      const item = model.update(oldItem, where);
      return item;
    } else {
      return {};
    }
  
  }

  export const updateDataWithTranz = (req, model, oldItem, where,t) => {
    if (req.id) {
      const item = model.update(oldItem, where,t);
      return item;
    } else {
      return {};
    }
  
  }
  
  
  export const userSpread = function (req) {
    if (req.params.id) {
      return {
        user_updated_id: req.user.id,
        branch_id: req.user.branch_id,
      };
    } else {
      return {
        user_created_id: req.user.id,
        user_updated_id: req.user.id,
        branch_id: req.user.branch_id,
      };
    }
  };
  
  
  
  export const excludeData = function () {
    return [
      "createdAt",
      "updatedAt"
    ];
  };
  export const excludeDataForComment = function () {
    return [
      "user_created_id",
      "user_updated_id",
      "branch_id"
    ];
  };
  
  export const excludeDataForCompleteTask = function () {
    return [
      "createdAt",
      "user_created_id",
      "user_updated_id",
      "branch_id"
    ];
  };
  
  
  export const excludeSetData = function () {
    return [
      "id",
      "createdAt",
      "updatedAt",
      "user_created_id",
      "user_updated_id",
      "branch_id"
    ];
  };


  export const updateOrCreate = function (model, where, newItem) {
    // First try to find the record
   const foundItem =  model.findOne({where});
   if (!foundItem) {
        // Item not found, create a new one
        const item =  model.create(newItem)
        return  {item, created: true};
    }
    // Found an item, update it
    const item =  model.update(newItem, {where});
    return {item, created: false};
}


export const sendOPTVerificationEmail =  async function (customer_id,email) 
{
try {
  const opt = `${Math.floor(100 + Math.random() * 9000)}`;
  
  const saltRound = 10;

  const hashOTP = await argon.hash(`${saltRound}`);

  let details = {
    email : email,
    customer_id : customer_id,
    opt : opt,
    year :  new Date().getFullYear()
  }

  await this.mailerService.sendMail({
    to: email,
    subject: 'Verify Your Email',
    template: 'opt',
    context: {
      details
    }
})

  
} catch (error) {
  
}
}



  

//   let result = await createData(ProjectWorkPlan, { ...insertdata, ...userSpread(req) });