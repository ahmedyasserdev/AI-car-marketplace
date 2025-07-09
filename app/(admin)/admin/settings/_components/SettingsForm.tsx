'use client'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, Shield } from "lucide-react"
import WorkingHoursForm from "./WorkingHoursForm"
import UserRoleManagement from "./UserRoleManagement"

const SettingsForm = () => {
  return (
    <div className='space-y-6'>
     <Tabs defaultValue="hours">
        <TabsList>
          <TabsTrigger value="hours">
            <Clock className="h-4 w-4 mr-2" />
            Working Hours
          </TabsTrigger>
          <TabsTrigger value="admins">
            <Shield className="h-4 w-4 mr-2" />
            Admin Users
          </TabsTrigger>
        </TabsList>
        <TabsContent value="hours" className="space-y-6 mt-6">
          <WorkingHoursForm/>

        </TabsContent>
   
        <TabsContent value="admins" className="space-y-6 mt-6">
          <UserRoleManagement />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default SettingsForm