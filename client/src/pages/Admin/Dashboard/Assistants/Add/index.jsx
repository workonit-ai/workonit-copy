import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { failureToaster, successToaster } from "../../../../../utils/swal.js";
import { postRequest } from "../../../../../api";
import { XCircle } from "lucide-react";

import { Plus, X } from "lucide-react";

const AddAssistants = () => {
  const navigate = useNavigate();
  const [body, setBody] = useState({
    name: "",
    tagline: "",
    api_key: "",
    sampleQuestions: [""],
  });

  const callApi = async (e) => {
    e.preventDefault();
    try {
      const response = await postRequest("/admin/add-assistant", body);
      successToaster("Assistant added successfully");
      navigate("/dashboard/assistants");
    } catch (error) {
      failureToaster("Error adding assistant");
    }
  };

  const handleChange = (e) => {
    setBody({ ...body, [e.target.name]: e.target.value });
  };

  const handleQuestionChange = (index, value) => {
    const updatedQuestions = [...body.sampleQuestions];
    updatedQuestions[index] = value;
    setBody({ ...body, sampleQuestions: updatedQuestions });
  };

  const addQuestion = () => {
    setBody({ ...body, sampleQuestions: [...body.sampleQuestions, ""] });
  };

  const removeQuestion = (index) => {
    const updatedQuestions = body.sampleQuestions.filter((_, i) => i !== index);
    setBody({ ...body, sampleQuestions: updatedQuestions });
  };

  return (
    <div className="main">
      <div className="card-box mb-4">
        <div className="employee-heading">
          <h3>Add Assistant</h3>
        </div>
      </div>

      <div className="form row" style={{ marginTop: "20px" }}>
        <input
          type="text"
          name="name"
          value={body.name}
          onChange={handleChange}
          placeholder="Assistant Name"
          className="form-input"
        />
        <input
          type="text"
          name="tagline"
          value={body.tagline}
          onChange={handleChange}
          placeholder="Assistant Tagline"
          className="form-input"
        />
        <input
          type="text"
          name="api_key"
          value={body.api_key}
          onChange={handleChange}
          placeholder="API Key"
          className="form-input"
        />

        {/* <div className="sample-questions">
                    <h4>Sample Questions</h4>
                    {body.sampleQuestions.map((question, index) => (
                        <div key={index} className="question-input">
                            <input
                                type="text"
                                value={question}
                                onChange={(e) => handleQuestionChange(index, e.target.value)}
                                placeholder={`Sample Question ${index + 1}`}
                                className="form-input"
                            />
                            <button onClick={() => removeQuestion(index)} className="remove-btn">Remove</button>
                        </div>
                    ))}
                    <button onClick={addQuestion} className="add-btn">Add Question</button>
                </div>
				 */}

        <h4 className="text-xl font-semibold mb-2">Sample Questions</h4>
        {body.sampleQuestions.map((question, index) => (
          <div key={index} className="flex items-center mb-2">
			<button
              onClick={() => removeQuestion(index)}
              className="remove-btn justify-end"
            >
              <X size={16} />
            </button>
            <input
              type="text"
              value={question}
              onChange={(e) => handleQuestionChange(index, e.target.value)}
              placeholder={`Sample Question ${index + 1}`}
              className="form-input flex"
            />
            
          </div>
        ))}
        <button
          onClick={addQuestion}
          className="flex items-center text-blue-500 hover:text-blue-700 mb-4"
        >
          <Plus size={16} className="mr-1" /> Add Question
        </button>

        <button className="primary-btn" onClick={(e) => callApi(e)}>
          Add Assistant
        </button>
      </div>
    </div>
  );
};

export default AddAssistants;
