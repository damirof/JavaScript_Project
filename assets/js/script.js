




let toast = (text, isError = false) => {
    Toastify({
        text: text,
        duration: 2000,
        gravity: "top",
        position: "right",
        style: {
            background: isError 
                ? "linear-gradient(to right, #ff5f6d, #ffc371)" 
                : "linear-gradient(to right, #00b09b, #96c93d)",
        },
    }).showToast();
};