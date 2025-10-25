import React, { useState } from "react";
import {
  FaPlus,
  FaEdit,
  FaUser,
  FaHome,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaCalendarAlt,
} from "react-icons/fa";
import { FcManager } from "react-icons/fc";
const NewFlat = () => {
  const [newFlatData, setNewFlatData] = useState({
    flatNo: "",
    ownerName: "",
    phone: "",
    email: "",
    nidNumber: "",
    address: "",
    moveInDate: "",
  });

  const [updateOwnerData, setUpdateOwnerData] = useState({
    flatNo: "",
    newOwnerName: "",
    phone: "",
    email: "",
    nidNumber: "",
    address: "",
    changeDate: "",
  });

  const handleNewFlatSubmit = () => {
    console.log("New Flat Data:", newFlatData);
    alert("New flat added successfully!");
  };

  const handleUpdateOwnerSubmit = () => {
    console.log("Update Owner Data:", updateOwnerData);
    alert("Owner information updated successfully!");
  };

  return (
    <div className="container py-4 px-6 mx-auto mt-24 lg:mt-10 text-sm">
      <div className="mb-6">
        <div className="flex space-x-4 py-4">
          <FcManager className="text-4xl mt-1 border border-gray-300 rounded-xl" />
          <h1 className="text-3xl font-bold ">Flat Management </h1>
        </div>
        <p className="text-gray-600 text-sm">
          Add new flats information
        </p>
      </div>

<div className="container ">
        <div className="max-w-3xl mx-auto">
        {/* Add New Flat */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4">
            <div className="flex items-center gap-3 text-white">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 bg-opacity-20 p-2 border border-gray-200 rounded-lg">
                <FaPlus className="w-4 h-4 " />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Add New Flat</h2>
                <p className="text-blue-100 text-xs">
                  Register a new flat with owner details
                </p>
              </div>
            </div>
          </div>

          <div className="p-5">
            {[
              {
                label: "Flat Number",
                icon: <FaHome />,
                key: "flatNo",
                type: "text",
                placeholder: "e.g., A-101",
              },
              {
                label: "Owner Name",
                icon: <FaUser />,
                key: "ownerName",
                type: "text",
                placeholder: "Enter owner's full name",
              },
              {
                label: "Phone Number",
                icon: <FaPhone />,
                key: "phone",
                type: "tel",
                placeholder: "+880 1XXX-XXXXXX",
              },
              {
                label: "Email Address",
                icon: <FaEnvelope />,
                key: "email",
                type: "email",
                placeholder: "owner@example.com",
              },
              {
                label: "NID Number",
                icon: <FaUser />,
                key: "nidNumber",
                type: "text",
                placeholder: "National ID Number",
              },
            ].map((field) => (
              <div key={field.key} className="mb-4">
                <label className="flex items-center gap-2 text-gray-700 text-xs font-semibold mb-1">
                  <span className="text-blue-600">{field.icon}</span>
                  {field.label}
                </label>
                <input
                  type={field.type}
                  placeholder={field.placeholder}
                  value={newFlatData[field.key]}
                  onChange={(e) =>
                    setNewFlatData({ ...newFlatData, [field.key]: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none transition"
                />
              </div>
            ))}

            <div className="mb-4">
              <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 mb-1">
                <FaMapMarkerAlt className="text-blue-600" />
                Permanent Address
              </label>
              <textarea
                placeholder="Enter full permanent address"
                value={newFlatData.address}
                onChange={(e) =>
                  setNewFlatData({ ...newFlatData, address: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none transition resize-none text-sm"
                rows={2}
              />
            </div>

            <div className="mb-4">
              <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 mb-1">
                <FaCalendarAlt className="text-blue-600" />
                Move-in Date
              </label>
              <input
                type="date"
                value={newFlatData.moveInDate}
                onChange={(e) =>
                  setNewFlatData({ ...newFlatData, moveInDate: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none transition"
              />
            </div>

            <button
              onClick={handleNewFlatSubmit}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2 px-4 rounded-md font-medium text-sm hover:from-blue-700 hover:to-blue-800 transition-all duration-300 transform hover:scale-105 hover:shadow-md active:scale-95 flex items-center justify-center gap-2"
            >
              <FaPlus /> Add New Flat
            </button>
          </div>
        </div>


      </div>
</div>
    </div>
  );
};

export default NewFlat;
