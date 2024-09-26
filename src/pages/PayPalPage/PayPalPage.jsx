import axios from "axios";

const PayPalButton = () => {
  const handlePayment = async () => {
    try {
      // Call your backend to create the PayPal payment
      const response = await axios.post(
        "http://localhost:5000/create-payment",
        {
          totalAmount: "10.00", // Adjust the amount dynamically
        }
      );
      if (response && response.data) {
        let link = response.data.links[1].href;
        window.location.href = link;
      }

      // Redirect to PayPal approval page
      if (response.data && response.data.redirectUrl) {
        window.location.href = response.data.redirectUrl;
      }
    } catch (error) {
      console.error("Payment creation error:", error);
    }
  };

  return (
    <div className="flex justify-center h-screen">
      <div className="flex justify-center flex-col">
        <button onClick={handlePayment} style={styles.button}>
          Go to PayPal
        </button>
      </div>
    </div>
  );
};

const styles = {
  button: {
    padding: "10px 20px",
    backgroundColor: "#0070ba",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
  },
};

export default PayPalButton;
