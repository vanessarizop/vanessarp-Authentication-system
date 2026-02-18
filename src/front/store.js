export const initialStore=()=>{
  return{
   message: null,
   user: null,
   token: localStorage.getItem("token") || null
  }
}


export default function storeReducer(store, action = {}) {
  switch(action.type){
  
    case 'signup_user':
      return {
        ...store,
        user: action.payload
      };
    
    
    case 'login_user':
      return {
        ...store,
        user: action.payload.user,
        token: action.payload.token
      };

    case 'logout':
      return {
        ...store,
        user: null,
        token: null
      };

    case 'private':
      return {
        ...store,
        message: action.payload
      };

      default:
      throw Error('Unknown action.');
  }    
}
