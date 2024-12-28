import { HiOutlineExclamationCircle } from "react-icons/hi";

const DeleteModal = ({ showModal, setShowModal, handleDeleteVehicle }) => {
  return (
    <>
      {showModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg w-96 p-6 shadow-lg">
            <div className="flex justify-between items-center">
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setShowModal(false)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="text-center my-4">
              <HiOutlineExclamationCircle
                className="mx-auto mb-4 text-gray-500"
                style={{ fontSize: "5rem" }}
              />
              <h3 className="mb-5 text-2xl text-gray-600">
                Are you sure you want to delete this vehicle?
              </h3>
              <div className="flex justify-center gap-4">
                <button
                  onClick={handleDeleteVehicle}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Yes, I'm sure
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100"
                >
                  No, cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DeleteModal;
