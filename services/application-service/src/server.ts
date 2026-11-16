import express from "express";
import { applications, responses } from "./data.js";


const app = express();
const PORT = 4002;

app.use(express.json());

// Health check
app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "OK",
    service: "application-service"
  });
});

// Retrieve all applications
app.get("/applications", (_req, res) => {
  res.status(200).json(applications);
});

// Retrieve one user by ID
app.get("/applications/:id", (req, res) => {
  const app = applications.find(
    (app) => app.id === req.params.id
  );

  if (!app) {
    return res.status(404).json({
      message: "Application not found"
    });
  }

  res.status(200).json(app);
});

app.patch(
    "/applications/:id/responses/:responseId",
    (req, res) => {
        const { id, responseId } = req.params;
        const { answer } = req.body;

        const application = applications.find(
            application => application.id === id
        );

        if(!application) {
            return res.status(404).json({
                message: "Application not found"
            });
        }

        if(!application.responseIds.includes(responseId)) {
            return res.status(404).json({
                message: "Response not associated with this application"
            });
        }

        if (typeof answer !== "string") {
            return res.status(400).json({
                message: "Answer must be a string"
            });
        }

        const response = responses.find(
            response => response.id === responseId
        );

        if (!response){
            return res.status(404).json({
                message: "Response not found"
            });
        }

        response.answer = answer;
        response.updatedAt = new Date().toISOString();

        return res.status(200).json(response);
    }
)

app.listen(PORT, () => {
  console.log(`Application service running at http://localhost:${PORT}`);
});