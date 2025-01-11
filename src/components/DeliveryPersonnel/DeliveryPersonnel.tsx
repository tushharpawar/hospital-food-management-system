"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import { Button } from "../ui/button";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

interface Task {
  id: string;
  status: string;
  deliveryLocation: string;
}

const Page = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const fetchDeliveryTasks = async () => {
    try {
      const response = await axios.get("/api/get-delivery-task");
      if(response.status === 201){
        setTasks(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching delivery tasks:", error);
      toast({
        title: "Failed to fetch delivery tasks",
      });
    }
  };

  useEffect(() => {
    fetchDeliveryTasks();
  }, []);

  const handleDialogOpen = (task:any) => {
    setSelectedTask(task);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setSelectedTask(null);
  };

  const handleStatusChange = (e:any) => {
    setSelectedTask((prev:any) => ({
      ...prev,
      status: e.target.value,
    }));
  };

  const handleUpdateStatus = async (id:any) => {
    try {
      await axios.post(`/api/update-delivery-status`, {
        status: selectedTask?.status,
        id
      });

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === selectedTask?.id ? { ...task, status: selectedTask.status } : task
        )
      );

      toast({
        title: "Status updated successfully",
      });

      handleDialogClose();
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        title: "Failed to update status",
      });
    }
  };
            const router = useRouter()
            const handleLogout =async () =>{
              await signOut({redirect:false})
              router.replace('/sign-in')
            }

  return (
    <div className="container mx-auto p-6">
      <div className="flex gap-4">
      <Typography variant="h4" gutterBottom>
        Delivery Personnel Tasks
      </Typography>
            <Button onClick={handleLogout} variant="outline">Logout</Button>
      </div>

      {tasks.length === 0 ? (
        <Typography>No delivery tasks available.</Typography>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task) => (
            <Card key={task.id} className="shadow-lg">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Delivery Task
                </Typography>
                <Typography>
                  <strong>Status:</strong> {task.status}
                </Typography>
                <Typography>
                  <strong>Location:</strong> {task.deliveryLocation}
                </Typography>
                <Button
                  className="mt-4"
                  onClick={() => handleDialogOpen(task)}
                >
                  Edit Status
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Status Dialog */}
      <Dialog open={openDialog} onClose={handleDialogClose} fullWidth>
        <DialogTitle>Edit Status</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel>Status</InputLabel>
            <Select
              value={selectedTask?.status || ""}
              onChange={handleStatusChange}
              label="Status"
            >
              <MenuItem value="ON_THE_WAY">On the Way</MenuItem>
              <MenuItem value="DELIVERED">Delivered</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button variant="outline" onClick={handleDialogClose}>
            Cancel
          </Button>
          <Button  onClick={()=>handleUpdateStatus(selectedTask?.id)}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Page;
