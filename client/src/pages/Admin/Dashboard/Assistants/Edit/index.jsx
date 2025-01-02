import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { failureToaster, successToaster } from '../../../../../utils/swal.js';
import { getRequest, putRequest } from '../../../../../api';
import { Plus, X } from "lucide-react";

const EditAssistant = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [body, setBody] = useState({
        name: "",
        tagline: "",
        assistant_id: "",
        sampleQuestions: [],
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchAssistantDetails();
    }, [id]);

    const fetchAssistantDetails = async () => {
        try {
            const response = await getRequest(`/assistant/get/${id}`);
            const assistant = response.data.assistant;
            setBody({
                name: assistant.name,
                tagline: assistant.tagline,
                assistant_id: assistant.assistant_id,
                sampleQuestions: assistant.sampleQuestions || [],
            });
            setIsLoading(false);
        } catch (error) {
            failureToaster("Error fetching assistant details");
            navigate("/dashboard/assistants");
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const response = await putRequest(`/assistant/update/${id}`, body);
            successToaster("Assistant updated successfully");
            navigate("/dashboard/assistants");
        } catch (error) {
            failureToaster("Error updating assistant");
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

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="main">
            <div className="card-box mb-4">
                <div className="employee-heading">
                    <h3>Edit Assistant</h3>
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
                    name="assistant_id"
                    value={body.assistant_id}
                    onChange={handleChange}
                    placeholder="API Key"
                    className="form-input"
                />

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

                <button className="primary-btn" onClick={handleUpdate}>
                    Update Assistant
                </button>
            </div>
        </div>
    );
};

export default EditAssistant;