"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

interface Task {
  id: string;
  status: string;
  deliveryPersonnelName?: string;
  deliveryPersonnelContact?: string;
  dietChart: {
    mealtime: string;
    ingredients: string;
    instructions: string;
    location: string;
  };
}

const Page = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  const fetchTasks = async () => {
    try {
      const response = await axios.get("/api/get-pantry-tasks");
      if (response.status === 201) {
        setTasks(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleDialogOpen = (task:any) => {
    setSelectedTask(task);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setSelectedTask(null);
  };

  const handleInputChange = (e:any) => {
    const { name, value } = e.target;
    setSelectedTask((prev:any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleStatusChange = (e:any) => {
    setSelectedTask((prev:any) => ({
      ...prev,
      status: e.target.value,
    }));
  };

  const router = useRouter();
  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.replace("/sign-in");
  };

  const handleUpdate = async (id:any) => {
    try {
      if (!selectedTask?.status || !selectedTask?.deliveryPersonnelContact) {
        toast({
          title: "please add all fields",
          variant: "destructive",
        });
      }

      const response = await axios.post(`/api/update-pantry-task-status`, {
        status: selectedTask?.status,
        deliveryPersonnelName: selectedTask?.deliveryPersonnelName,
        deliveryPersonnelContact: selectedTask?.deliveryPersonnelContact,
        id,
      });

      if (response.status === 202) {
        toast({ title: "Task updated successfully!" });
        handleDialogClose();
        fetchTasks();
      }
    } catch (error) {
      console.error("Failed to update task:", error);
      toast({ title: "Failed to update task.", variant: "destructive" });
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className=" flex gap-4">
        <h1 className="text-2xl sm:text-4xl font-semibold mb-6">
          Pantry Tasks
        </h1>
        <Button onClick={handleLogout} variant="outline">
          Logout
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <div
              key={task.id}
              className="p-4 border rounded-lg shadow-lg bg-white"
            >
              <h2 className="text-lg font-bold mb-2">
                {task.dietChart.mealtime}
              </h2>
              <p className="mb-2">
                <strong>Ingredients:</strong> {task.dietChart.ingredients}
              </p>
              <p className="mb-2">
                <strong>Instructions:</strong> {task.dietChart.instructions}
              </p>
              <p className="mb-2">
                <strong>Location:</strong> {task.dietChart.location}
              </p>
              <p className="mb-2">
                <strong>Status:</strong> {task.status}
              </p>
              <div className="mt-4">
                <h3 className="font-semibold">Delivery Personnel Details</h3>
                <p>
                  <strong>Name:</strong> {task.deliveryPersonnelName || "N/A"}
                </p>
                <p>
                  <strong>Contact:</strong>{" "}
                  {task.deliveryPersonnelContact || "N/A"}
                </p>
              </div>
              <div className="flex gap-4 mt-4">
                <Button onClick={() => handleDialogOpen(task)}>Edit</Button>
              </div>
            </div>
          ))
        ) : (
          <p>No tasks available</p>
        )}
      </div>

      {selectedTask && (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Dialog open={openDialog} onClose={handleDialogClose} fullWidth>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogContent>
              <FormControl fullWidth margin="normal">
                <InputLabel>Status</InputLabel>
                <Select
                  value={selectedTask.status}
                  onChange={handleStatusChange}
                  label="Status"
                >
                  <MenuItem value="PENDING">Pending</MenuItem>
                  <MenuItem value="COMPLETED">Completed</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Delivery Personnel Name"
                name="deliveryPersonnelName"
                value={selectedTask.deliveryPersonnelName || ""}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Delivery Personnel Contact"
                name="deliveryPersonnelContact"
                value={selectedTask.deliveryPersonnelContact || ""}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
              {/* Time Picker for Delivery Time */}
            </DialogContent>
            <DialogActions>
              <Button variant="outline" onClick={handleDialogClose}>
                Cancel
              </Button>
              <Button onClick={() => handleUpdate(selectedTask.id)}>
                Save
              </Button>
            </DialogActions>
          </Dialog>
        </LocalizationProvider>
      )}
    </div>
  );
};

export default Page;
