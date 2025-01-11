/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import React, { useEffect, useState } from 'react'
import axios from "axios";
import { useParams, useRouter } from 'next/navigation';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField,Select, MenuItem, InputLabel, FormControl, SelectChangeEvent} from "@mui/material";
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface Diet {
  id: string;
  mealTime: string;
  ingredients: string;
  instructions: string;
  staffName: string;
  staffContact: string;
  location: string;
}

interface DietDetails {
  mealTime: string;
  ingredients: string;
  instructions: string;
  staffName: string;
  staffContact: string;
  location: string;
}



const Page = () => {

    const {id} = useParams()
    const [patient,setPatient] = useState({
      name: '',
      age: '',
      gender: '',
      contactInfo: '',
      allergies: '',
      diseases: '',
      bedNumber: '',
      floorNumber: '',
      roomNumber: ''
    })

    const getPatient = async()=>{
        const response = await axios.get(`/api/get-patient/${id}`)

        if(response.status === 201){
            setPatient(response.data.data)
        }
    }

    const [openDialog, setOpenDialog] = useState(false);
    const [openEditDietDialog, setOpenEditDietDialog] = useState(false);
    const [updatedPatient, setUpdatedPatient] = useState(patient);
    const [dietId, setDietId] = useState();

    
    const [dietChart, setDietChart] = useState<Diet[]>([]);
    const [openDietDialog, setOpenDietDialog] = useState(false);

    const [dietDetails, setDietDetails] = useState<DietDetails>({
      mealTime: '',
      ingredients: '',
      instructions: '',
      staffName: '',
      staffContact: '',
      location: '',
    });
    const router = useRouter();
    const {toast} = useToast()


    useEffect(()=>{
        getPatient()
        fetchDietChart()
    },[])

    
    const handleDialogClose = () => {
        setOpenDialog(false);
      };
    
      const handleDialogOpen = () => {
        setOpenDialog(true);
      };
    
      const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUpdatedPatient((prev) => ({
          ...prev,
          [name]: value,
        }));
      };

      const handleGenderChange = (e:any) =>{
        setUpdatedPatient((prev)=>({
            ...prev,
            gender:e.target.value
        })
        )
      }
    
      const handleDelete = async() => {
        await axios.post(`/api/delete-patient/${id}`)
        router.push("/");
      };

      const handleUpdate =async () => {
         await axios.post(`/api/update-patient-details/${id}`,{
            updatedPatient
        })

        setPatient((prev) => ({
            ...prev,
            ...updatedPatient,
          }));
        setOpenDialog(false);
      };
    

      const fetchDietChart = async () => {        
        
        const response = await axios.get(`/api/get-diet-of-patient/${id}`);
        if (response.status === 201) {
          setDietChart(response.data.data);
        } else {
          setDietChart([]);
        }
      };
    
    
      const handleDietDialogClose = () => {
        setOpenDietDialog(false);
      };
      
      const handleDietInputChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
        const { name, value } = e.target as HTMLInputElement;
        setDietDetails((prev:any) => ({
          ...prev,
          [name]: value,
        }));
      };

      const handleMealTimeInputChange = (e: SelectChangeEvent<string>) => {
        const { value } = e.target;
        setDietDetails((prev:any) => ({
          ...prev,
          mealTime : value,
        }));
      };

      const handleDietDialogOpen = () =>{
        setOpenDietDialog(true);
      }
      

      const handleAddDietChart = async () => {

        try {
          setDietDetails({
            mealTime: '',
            ingredients: '',
            instructions: '',
            staffName: '',
            staffContact: '',
            location: '',
          })
            const response = await axios.post(`/api/create-diet-chart/${id}`,{
                dietDetails
            })

            if(response.status === 201){
                toast({
                    title:"Diet chart created!"
                })
                setDietChart((prev:any)=>[...prev,response.data.data])
            }
        } catch (error) {
            console.log("Error",error);
            if (axios.isAxiosError(error)) {
                if (error.response) {

                  const { status } = error.response;
            
                  switch (status) {
                    case 404:
                      toast({ title: 'Failed to create diet chart! Resource not found.',variant:'destructive' });
                      break;
                    case 400:
                      toast({ title: 'All fields are required.',variant:'destructive' });
                      break;
                    case 402:
                      toast({ title: 'Meal already exist with this time period',variant:'destructive' });
                      break;
                    case 403:
                      toast({ title: 'Staff not found.',variant:'destructive' });
                      break;
                    default:
                      toast({ title: 'An unexpected error occurred.',variant:'destructive' });
                  }
                } else if (error.request) {
                  console.log('No response received:', error.request);
                  toast({ title: 'Failed to connect to the server. Please try again.' });
                } else {
                  console.log('Axios error:', error.message);
                  toast({ title: 'An unexpected error occurred. Please try again.' });
                }
              } else {
                console.log('Unexpected error:', error);
                toast({ title: 'Something went wrong. Please try again.' });
              }
        }
        setOpenDietDialog(false);
      };

      const handleEditDietDialogClose = () =>{
        setOpenEditDietDialog(false);
      }
      const handleEditDietChartOpen = (id:any) =>{
        setDietId(id)
        setOpenEditDietDialog(true);
      }
    
      const handleEditDietChart = async () => {
        try {
            const response = await axios.post(`/api/update-diet-chart/${dietId}`,{
                dietDetails
            })

            if(response.status === 202){
                toast({
                    title:"Diet Updated"
                })
                fetchDietChart()
                handleEditDietDialogClose()
            }
        } catch (error) {
            console.log("Error",error);
            setOpenEditDietDialog(false);
        }
      };
    
      const handleDeleteDietChart = async (dietChartId:string) => {
        try {

            const response = await axios.post(`/api/delete-diet-chart/`,{
                dietChartId
            })

            if(response.status === 202){
                toast({
                    title:"Diet Deleted"
                })
                fetchDietChart()
            }
        } catch (error) {
            console.log("Error",error);
            setOpenEditDietDialog(false);
        }
      };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl sm:text-3xl font-semibold">Patient Details</h1>
        <Button
          onClick={handleDialogOpen}
        >
          Edit Details
        </Button>
        <Button
          onClick={handleDietDialogOpen}
        >
          create diet chart
        </Button>
      </div>

      {/* Patient Details Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-5 border rounded-lg shadow-lg">
          <div className="mb-4">
            <p className="font-semibold">Name:</p>
            <p>{patient.name}</p>
          </div>
          <div className="mb-4">
            <p className="font-semibold">Age:</p>
            <p>{patient.age}</p>
          </div>
          <div className="mb-4">
            <p className="font-semibold">Gender:</p>
            <p>{patient.gender}</p>
          </div>
          <div className="mb-4">
            <p className="font-semibold">Contact Info:</p>
            <p>{patient.contactInfo}</p>
          </div>
          <div className="mb-4">
            <p className="font-semibold">Allergies:</p>
            <p>{patient.allergies}</p>
          </div>
          <div className="mb-4">
            <p className="font-semibold">Diseases:</p>
            <p>{patient.diseases}</p>
          </div>
          <div className="mb-4">
            <p className="font-semibold">Bed Number:</p>
            <p>{patient.bedNumber}</p>
          </div>
          <div className="mb-4">
            <p className="font-semibold">Floor Number:</p>
            <p>{patient.floorNumber}</p>
          </div>
          <div className="mb-4">
            <p className="font-semibold">Room Number:</p>
            <p>{patient.roomNumber}</p>
          </div>

          <div className="flex justify-center gap-4 mt-6">
        <Button
          variant="destructive"
          onClick={handleDelete}
        >
          Delete Patient
        </Button>
      </div>
        </div>

      <div className="">
        <div className="mt-6">
        <h2 className="text-lg font-semibold">Diet Chart</h2>
        {dietChart.length > 0 ? (
          <div className="mt-4 space-y-4">
            {dietChart.map((diet) => (
              <div key={diet.id} className="p-4 border rounded-lg shadow-lg">
                <p className="font-semibold">Meal Time: {diet.mealTime}</p>
                <p>Ingredients: {diet.ingredients}</p>
                <p>Instructions: {diet.instructions}</p>
                <p>Staff Name: {diet.staffName}</p>
                <p>Staff Contact: {diet.staffContact}</p>
                <p>Location: {diet.location}</p>
                <div className="mt-2 flex gap-2">
                  <Button onClick={()=>handleEditDietChartOpen(diet.id)}>Edit</Button>
                  <Button variant="destructive" onClick={() => handleDeleteDietChart(diet.id)}>
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No diet chart available for this patient.</p>
        )}
      </div>
        </div>
      </div>

      {/* Dialog for Edit patient details */}
      
      <Dialog open={openDialog} onClose={handleDialogClose} fullWidth>
        <DialogTitle>Edit Patient Details</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            name="name"
            value={updatedPatient.name}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Age"
            name="age"
            value={updatedPatient.age}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Gender</InputLabel>
            <Select
              name="gender"
              value={updatedPatient.gender}
              onChange={handleGenderChange}
              label="Gender"
            >
              <MenuItem value="male">male</MenuItem>
              <MenuItem value="female">female</MenuItem>
              <MenuItem value="others">others</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Contact Info"
            name="contactInfo"
            value={updatedPatient.contactInfo}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Allergies"
            name="allergies"
            value={updatedPatient.allergies}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Diseases"
            name="diseases"
            value={updatedPatient.diseases}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Bed Number"
            name="bedNumber"
            value={updatedPatient.bedNumber}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Floor Number"
            name="floorNumber"
            value={updatedPatient.floorNumber}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Room Number"
            name="roomNumber"
            value={updatedPatient.roomNumber}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} variant="outline">
            Cancel
          </Button>
          <Button onClick={handleUpdate}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

        {/* Dialog for creating diet */}
      <Dialog open={openDietDialog} onClose={handleDietDialogClose} fullWidth>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel>Meal Time</InputLabel>
            <Select name="mealTime" value={dietDetails.mealTime} onChange={handleMealTimeInputChange}>
              <MenuItem value="MORNING">Morning</MenuItem>
              <MenuItem value="EVENING">Evening</MenuItem>
              <MenuItem value="NIGHT">Night</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Ingredients"
            name="ingredients"
            value={dietDetails.ingredients}
            onChange={handleDietInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Instructions"
            name="instructions"
            value={dietDetails.instructions}
            onChange={handleDietInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Staff Name"
            name="staffName"
            value={dietDetails.staffName}
            onChange={handleDietInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Staff Contact"
            name="staffContact"
            value={dietDetails.staffContact}
            onChange={handleDietInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Location"
            name="location"
            value={dietDetails.location}
            onChange={handleDietInputChange}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button variant="outline" onClick={handleDietDialogClose}>Cancel</Button>
          <Button onClick={handleAddDietChart}>Submit</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for Edit diet details */}

      <Dialog open={openEditDietDialog} onClose={handleEditDietDialogClose} fullWidth>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel>Meal Time</InputLabel>
            <Select name="mealTime" value={dietDetails.mealTime} onChange={handleMealTimeInputChange}>
              <MenuItem value="MORNING">Morning</MenuItem>
              <MenuItem value="EVENING">Evening</MenuItem>
              <MenuItem value="NIGHT">Night</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Ingredients"
            name="ingredients"
            value={dietDetails.ingredients}
            onChange={handleDietInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Instructions"
            name="instructions"
            value={dietDetails.instructions}
            onChange={handleDietInputChange}
            fullWidth
            margin="normal"
          />

          <TextField
            label="Location"
            name="location"
            value={dietDetails.location}
            onChange={handleDietInputChange}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button variant="outline" onClick={handleEditDietDialogClose}>Cancel</Button>
          <Button onClick={handleEditDietChart}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default Page

