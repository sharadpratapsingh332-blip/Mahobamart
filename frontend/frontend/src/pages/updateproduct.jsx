import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

const UpdateProduct = () => {

  const { id } = useParams();
  const navigate = useNavigate();
  
  const [name, setName] = useState("");
  const [description, setDescription] =
    useState("");

  const [price, setPrice] = useState("");

  const [stock, setStock] = useState("");

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    try {

      const res = await axios.get(
        `/products/${id}`
      );

      const product = res.data.product;

      setName(product.name);
      setDescription(product.description);
      setPrice(product.price);
      setStock(product.stock);
      setPreview(product.image);

    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
   
    const formData = new FormData();

      formData.append("name", name);
      formData.append( "description", description);
      formData.append("price", price);
      formData.append("stock", stock);

      if (image) {
           formData.append(
           "image",
           image
          );
       }

      await axios.put(
           `/products/${id}`,
            formData,
            {
              withCredentials: true,
              headers: {
               "Content-Type":
               "multipart/form-data"
            }
          }
       );

      alert(
        "Product updated successfully"
      );

      navigate("/my-shop");

    } catch (error) {

      console.log(error);

      alert(
        error.response?.data?.message
      );
    }
  };

  return (
    <>
      <Navbar />

      <div className="max-w-3xl mx-auto p-6">

        <div className="bg-white p-6 rounded-xl shadow">

          <h1 className="text-3xl font-bold mb-6">
            Update Product
          </h1>

          <form
            onSubmit={handleUpdate}
            className="space-y-4"
          >

            <input
              type="text"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              className="w-full border p-3 rounded"
            />

            <textarea
              value={description}
              onChange={(e) =>
                setDescription(
                  e.target.value
                )
              }
              className="w-full border p-3 rounded"
            />

            <input
              type="number"
              value={price}
              onChange={(e) =>
                setPrice(e.target.value)
              }
              className="w-full border p-3 rounded"
            />

            <input
              type="number"
              value={stock}              
              onChange={(e) =>
                setStock(e.target.value)
              }
              className="w-full border p-3 rounded"
            />

            {preview && (
                      <img
                         src={preview}
                         alt="Product"
                         className="w-40 h-40 object-cover rounded-lg"
                      />
             )}

            <input
                  type="file"
                  accept="image/*"
                  className="w-full border p-3 rounded"
                  onChange={(e) => {
                  setImage(
                       e.target.files[0]
                        );

                 setPreview(
                      URL.createObjectURL(
                        e.target.files[0]
                      )
                    );

                  }}
             />


            <button
              type="submit"
              className="w-full bg-green-600 text-white py-3 rounded active:scale-95 active:bg-green-800 transition-all duration-150"
            >
              Update Product
            </button>
       
          </form>

        </div>

      </div>
    </>
  );
};

export default UpdateProduct;