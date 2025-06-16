"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { useCategories } from "../../hooks/useCategories"

const EditSMSGroupModal = ({ isOpen, onClose, smsGroup, onSave, loading }) => {
  const [formData, setFormData] = useState({
    company_name: "",
    inbound_rate: "",
    outbound_rate: "",
    category: "",
  })

  const [errors, setErrors] = useState({})

  // Category options - you can modify these based on your requirements

  const {categories:categoryOptions} = useCategories();
  console.log(categoryOptions, 'category');
  
  // const categoryOptions = [
  //   "Restaurant",
  //   "Retail",
  //   "Healthcare",
  //   "Education",
  //   "Technology",
  //   "Finance",
  //   "Real Estate",
  //   "Automotive",
  //   "Entertainment",
  //   "Other",
  // ]

  useEffect(() => {
    if (smsGroup && isOpen) {
      setFormData(
        smsGroup
      )
      setErrors({})
    }
  }, [smsGroup, isOpen])

  console.log(smsGroup);

  console.log(formData, 'formdata');
  
  

  const handleInputChange = (e) => {
    const { name, value } = e.target
  
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData?.company_name || !formData.company_name.trim()) {
      newErrors.company_name = "Company name is required"
    }

    if (!formData.inbound_rate || isNaN(formData.inbound_rate) || Number.parseFloat(formData.inbound_rate) < 0) {
      newErrors.inbound_rate = "Valid inbound rate is required"
    }

    if (!formData.outbound_rate || isNaN(formData.outbound_rate) || Number.parseFloat(formData.outbound_rate) < 0) {
      newErrors.outbound_rate = "Valid outbound rate is required"
    }

    if (!formData.category) {
      newErrors.category = "Category is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (validateForm()) {
      console.log("category12211: ,", formData.category)
      onSave({
        location_id: smsGroup.location_id,
        data: {
          company_name:formData.company_name,
          location_name: formData.location_name,
          inbound_rate: Number.parseFloat(formData.inbound_rate),
          outbound_rate: Number.parseFloat(formData.outbound_rate),
          category_id: formData.category,
        },
      })
    }
  }

  const handleClose = () => {
    setFormData({
      company_name: "",
      inbound_rate: "",
      outbound_rate: "",
      category: "",
    })
    setErrors({})
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2 className="modal-title">Edit SMS Group <span className="text-2xl bg">{formData?.location_name}</span></h2>
          <button onClick={handleClose} className="close-button">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="company_name" className="form-label">
              Company Name
            </label>
            <input
              type="text"
              id="company_name"
              name="company_name"
              value={formData.company_name}
              onChange={handleInputChange}
              className={`form-input ${errors.company_name ? "error" : ""}`}
              placeholder="Enter company name"
            />
            {errors.company_name && <span className="error-message">{errors.company_name}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="inbound_rate" className="form-label">
                Inbound Rate ($)
              </label>
              <input
                type="number"
                id="inbound_rate"
                name="inbound_rate"
                value={formData.inbound_rate}
                onChange={handleInputChange}
                className={`form-input ${errors.inbound_rate ? "error" : ""}`}
                placeholder="0.00"
                step="0.01"
                min="0"
              />
              {errors.inbound_rate && <span className="error-message">{errors.inbound_rate}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="outbound_rate" className="form-label">
                Outbound Rate ($)
              </label>
              <input
                type="number"
                id="outbound_rate"
                name="outbound_rate"
                value={formData.outbound_rate}
                onChange={handleInputChange}
                className={`form-input ${errors.outbound_rate ? "error" : ""}`}
                placeholder="0.00"
                step="0.01"
                min="0"
              />
              {errors.outbound_rate && <span className="error-message">{errors.outbound_rate}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="category" className="form-label">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category.id}
              onChange={handleInputChange}
              className={`form-select ${errors.category ? "error" : ""}`}
            >
              <option value="">Select a category</option>
              {categoryOptions.map((option) => (
                <option key={option?.id} value={option?.id}>
                  {option?.category_name}
                </option>
              ))}
            </select>
            {errors.category && <span className="error-message">{errors.category}</span>}
          </div>

          <div className="modal-actions">
            <button type="button" onClick={handleClose} className="cancel-button" disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="save-button" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 1rem;
        }

        .modal-container {
          background-color: white;
          border-radius: 12px;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          width: 100%;
          max-width: 500px;
          max-height: 90vh;
          overflow-y: auto;
        }

        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.5rem 1.5rem 0;
          border-bottom: 1px solid #e5e7eb;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
        }

        .modal-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #111827;
          margin: 0;
        }

        .close-button {
          background: none;
          border: none;
          color: #6b7280;
          cursor: pointer;
          padding: 0.25rem;
          border-radius: 0.375rem;
          transition: all 0.2s ease;
        }

        .close-button:hover {
          color: #374151;
          background-color: #f3f4f6;
        }

        .modal-form {
          padding: 0 1.5rem 1.5rem;
        }

        .form-group {
          margin-bottom: 1.25rem;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .form-label {
          display: block;
          font-size: 0.875rem;
          font-weight: 500;
          color: #374151;
          margin-bottom: 0.5rem;
        }

        .form-input,
        .form-select {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #d1d5db;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          transition: all 0.2s ease;
          background-color: white;
        }

        .form-input:focus,
        .form-select:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .form-input.error,
        .form-select.error {
          border-color: #ef4444;
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
        }

        .error-message {
          display: block;
          color: #ef4444;
          font-size: 0.75rem;
          margin-top: 0.25rem;
        }

        .modal-actions {
          display: flex;
          gap: 0.75rem;
          justify-content: flex-end;
          margin-top: 2rem;
          padding-top: 1rem;
          border-top: 1px solid #e5e7eb;
        }

        .cancel-button {
          padding: 0.5rem 1rem;
          border: 1px solid #d1d5db;
          background-color: white;
          color: #374151;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .cancel-button:hover:not(:disabled) {
          background-color: #f9fafb;
          border-color: #9ca3af;
        }

        .save-button {
          padding: 0.5rem 1rem;
          background-color: #3b82f6;
          color: white;
          border: none;
          border-radius: 0.5rem;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .save-button:hover:not(:disabled) {
          background-color: #2563eb;
        }

        .save-button:disabled,
        .cancel-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        @media (max-width: 640px) {
          .modal-container {
            margin: 1rem;
            max-width: calc(100% - 2rem);
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .modal-actions {
            flex-direction: column-reverse;
          }

          .cancel-button,
          .save-button {
            width: 100%;
          }
        }
      `}</style>
    </div>
  )
}

export default EditSMSGroupModal
