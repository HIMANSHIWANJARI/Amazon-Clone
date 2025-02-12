export const getProducts = () => async (dispatch) => {
    try {
        const response = await fetch("/getproducts", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        const data = await response.json();
        console.log(data);

        dispatch({ type: "SUCCESS_GET_PRODUCTS", payload: data });
    } catch (error) {
        dispatch({ type: "FAIL_GET_PRODUCTS", payload: error.message });
    }
};
