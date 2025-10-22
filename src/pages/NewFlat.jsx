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
          Add new flats or update existing owner information
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
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

        {/* Update Owner Info */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-green-700 p-4">
            <div className="flex items-center gap-3 text-white">
              <div className="bg-green-700 bg-opacity-20 p-2 rounded-lg">
                <FaEdit className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Update Owner Info</h2>
                <p className="text-green-100 text-xs">
                  Change owner details for existing flat
                </p>
              </div>
            </div>
          </div>

          <div className="p-5">
            <div className="mb-4">
              <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 mb-1">
                <FaHome className="text-green-600" />
                Select Flat
              </label>
              <select
                value={updateOwnerData.flatNo}
                onChange={(e) =>
                  setUpdateOwnerData({
                    ...updateOwnerData,
                    flatNo: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-green-500 focus:outline-none transition"
              >
                <option value="">Choose a flat</option>
                <option value="A-101">A-101</option>
                <option value="B-201">B-201</option>
                <option value="C-301">C-301</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 mb-1">
                <FaUser className="text-green-600" />
                New Owner Name
              </label>
              <input
                type="text"
                placeholder="Enter new owner's full name"
                value={updateOwnerData.newOwnerName}
                onChange={(e) =>
                  setUpdateOwnerData({
                    ...updateOwnerData,
                    newOwnerName: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-green-500 focus:outline-none transition"
              />
            </div>

            <div className="mb-4">
              <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 mb-1">
                <FaPhone className="text-green-600" />
                Phone Number
              </label>
              <input
                type="tel"
                placeholder="+880 1XXX-XXXXXX"
                value={updateOwnerData.phone}
                onChange={(e) =>
                  setUpdateOwnerData({ ...updateOwnerData, phone: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-green-500 focus:outline-none transition"
              />
            </div>

            <div className="mb-4">
              <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 mb-1">
                <FaEnvelope className="text-green-600" />
                Email Address
              </label>
              <input
                type="email"
                placeholder="newowner@example.com"
                value={updateOwnerData.email}
                onChange={(e) =>
                  setUpdateOwnerData({ ...updateOwnerData, email: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-green-500 focus:outline-none transition"
              />
            </div>

            <div className="mb-4">
              <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 mb-1">
                <FaUser className="text-green-600" />
                NID Number
              </label>
              <input
                type="text"
                placeholder="National ID Number"
                value={updateOwnerData.nidNumber}
                onChange={(e) =>
                  setUpdateOwnerData({
                    ...updateOwnerData,
                    nidNumber: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-green-500 focus:outline-none transition"
              />
            </div>

            <div className="mb-4">
              <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 mb-1">
                <FaMapMarkerAlt className="text-green-600" />
                Permanent Address
              </label>
              <textarea
                placeholder="Enter full permanent address"
                value={updateOwnerData.address}
                onChange={(e) =>
                  setUpdateOwnerData({
                    ...updateOwnerData,
                    address: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-green-500 focus:outline-none transition resize-none text-sm"
                rows={2}
              />
            </div>

            <div className="mb-4">
              <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 mb-1">
                <FaCalendarAlt className="text-green-600" />
                Ownership Change Date
              </label>
              <input
                type="date"
                value={updateOwnerData.changeDate}
                onChange={(e) =>
                  setUpdateOwnerData({
                    ...updateOwnerData,
                    changeDate: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-green-500 focus:outline-none transition"
              />
            </div>

            <button
              onClick={handleUpdateOwnerSubmit}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-2 px-4 rounded-md font-medium text-sm hover:from-green-700 hover:to-green-800 transition-all duration-300 transform hover:scale-105 hover:shadow-md active:scale-95 flex items-center justify-center gap-2"
            >
              <FaEdit /> Update Owner Info
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewFlat;
