import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    currentCmt : null,
    loading : false,
    error: false

}

export const cmtSlice = createSlice({
    name: 'cmt',
    initialState,
    reducers: {
        cmtStart: (state)=>{
            state.loading = true;
        },
        cmtSuccess: (state, action)=>{
            state.loading = false;
            state.currentCmt = [...action.payload]
        },
        cmtFail: (state,action)=>{
            state.loading = false;  
        },
        deleteCmt:(state, action) =>{
            state.currentCmt.map(cmt => {
                if(cmt._id === action.payload.commentId && cmt.userId ===  action.payload.userId && cmt.postId === action.payload.postId){
                    state.currentCmt.splice(state.currentCmt.findIndex(
                        cmt => cmt._id != action.payload.commentId
                    ),1)
                }
            })

        },
       
     

    }
})

export const {cmtStart,cmtSuccess,cmtFail,newCmt,deleteCmt} = cmtSlice.actions

export default cmtSlice.reducer