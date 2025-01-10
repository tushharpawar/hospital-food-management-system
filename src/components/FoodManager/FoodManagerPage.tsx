"use client"

import React, { useEffect, useState } from 'react'
import axios from "axios";
import { Button } from '../ui/button'
import { useRouter } from 'next/navigation'
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField,Select, MenuItem, InputLabel, FormControl, SelectChangeEvent} from "@mui/material";
import { useToast } from '@/hooks/use-toast';
import { signOut } from 'next-auth/react';

const FoodManagerPage = () => {

    interface Patient {
      id: string;
      name: string;
      age: number;
      gender: string;
      contactInfo: string;
      bedNumber: string;
    }
    
    const [patients, setPatients] = useState<Patient[]>([])
    const [newPatient, setNewPatient] = useState<Patient[]>([])
    const [openDialog, setOpenDialog] = useState(false);
    const {toast} = useToast()
    const router = useRouter()

    const getPatients = async()=>{
        try {
            const response = await axios.get('/api/get-all-patient')

            if(response.status === 201){
                setPatients(response.data.data)
                console.log("PPP",response.data.data);
            }

        } catch (error) {
            console.log("Error while fetching patients",error);
        }
    }

    useEffect(()=>{
        getPatients()
    },[])

    const handleDialogClose = () => {
            setOpenDialog(false);
          };
        
          const handleDialogOpen = () => {
            setOpenDialog(true);
          };
        
          const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const { name, value } = e.target;
            setNewPatient((prev) => ({
              ...prev,
              [name]: value,
            }));
          };
    
          const handleGenderChange = (e) =>{
            setNewPatient((prev)=>({
                ...prev,
                gender:e.target.value
            })
            )
          }

          const handleSubmit =async ()=>{
            try {
              const response = await axios.post(`/api/create-patient`,{
                newPatient
              })

              if(response.status === 201){
                toast({
                  title:"Patient created!"
                })
                getPatients()
                handleDialogClose()
              }
            } catch (error) {
                console.log("Error",error);
                handleDialogClose()
            }
          }

          const handleLogout =async () =>{
            await signOut({redirect:false})
            router.replace('/sign-in')
          }
  return (
    <div>

    <div className=" flex p-5 m-5 gap-2">
    <h1 className=' w-full text-xl font-semibold'>Hospital food manager</h1>
    <Button onClick={handleDialogOpen}>Add patient</Button>
    <Button onClick={handleLogout} variant="outline">Logout</Button>
    </div>
    <div className="flex flex-col sm:flex-row gap-3 m-5 p-5">
    {patients.length > 0 ? (
    patients.map((patient, index) => (
      <div
        key={index}
        className="max-w-sm sm:max-w-md md:max-w-lg rounded-lg border border-gray-300 shadow-lg overflow-hidden"
      >
        {/* Card Header */}
        <div className="bg-zinc-800 text-white p-4 text-center font-semibold text-xl">
          {patient.name}
        </div>

        {/* Card Body */}
        <div className="p-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="mb-4 flex-1">
              <p className="font-semibold">Age:</p>
              <p>{patient.age}</p>
            </div>
            <div className="mb-4 flex-1">
              <p className="font-semibold">Gender:</p>
              <p>{patient.gender}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="mb-4 flex-1">
              <p className="font-semibold">Contact:</p>
              <p>{patient.contactInfo}</p>
            </div>
            <div className="mb-4 flex-1">
              <p className="font-semibold">Bed Number:</p>
              <p>{patient.bedNumber}</p>
            </div>
          </div>
        </div>

        {/* Card Footer */}
        <div className="bg-gray-100 p-4 text-center flex gap-4 justify-center">
          <Button onClick={()=>router.replace(`/${patient.id}`)}>
            View Details
          </Button>
        </div>

        <Dialog open={openDialog} onClose={handleDialogClose} fullWidth>
        <DialogTitle>Edit Patient Details</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            name="name"
            value={newPatient.name}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Age"
            name="age"
            value={newPatient.age}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Gender</InputLabel>
            <Select
              name="gender"
              value={newPatient.gender}
              onChange={handleGenderChange}
              label="Gender"
            >
              <MenuItem value="male">male</MenuItem>
              <MenuItem value="female">female</MenuItem>
              <MenuItem value="other">others</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Contact Info"
            name="contactInfo"
            value={newPatient.contactInfo}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Allergies"
            name="allergies"
            value={newPatient.allergies}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Diseases"
            name="diseases"
            value={newPatient.diseases}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Bed Number"
            name="bedNumber"
            value={newPatient.bedNumber}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Floor Number"
            name="floorNumber"
            value={newPatient.floorNumber}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Room Number"
            name="roomNumber"
            value={newPatient.roomNumber}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Emergency Contact"
            name="emergencyContact"
            value={newPatient.emergencyContact}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} variant="outline">
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
      </div>
    ))
    ) : (
        <p>There are no patients</p>
    )}
    </div>
</div>
  )
}

export default FoodManagerPage