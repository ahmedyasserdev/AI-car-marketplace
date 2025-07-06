'use client'
import { useFetch } from '@/hooks/useFetch';
import { getDealerShipInfo, saveWorkingHours } from '@/lib/actions/settings.actions';
import { useEffect, useState } from 'react';
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Clock, Loader2, Save } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DayOfWeek, WorkingHour } from '@prisma/client';
import { toast } from 'sonner';


type WorkingHoursFormProps = {}

const WorkingHoursForm = (props: WorkingHoursFormProps) => {
    const DAYS = [
        { value: DayOfWeek.MONDAY, label: "Monday" },
        { value: DayOfWeek.TUESDAY, label: "Tuesday" },
        { value: DayOfWeek.WEDNESDAY, label: "Wednesday" },
        { value: DayOfWeek.THURSDAY, label: "Thursday" },
        { value: DayOfWeek.FRIDAY, label: "Friday" },
        { value: DayOfWeek.SATURDAY, label: "Saturday" },
        { value: DayOfWeek.SUNDAY, label: "Sunday" },
    ];
    const [workingHours, setWorkingHours] = useState(
        DAYS.map((day) => ({
            dayOfWeek: day.value,
            openTime: "09:00",
            closeTime: "18:00",
            isOpen: day.value !== "SUNDAY",
        }))
    );

    const {
        loading: savingWorkingHours,
        fn: fetchDealershipInfo,
        data: settingsData,
        error: settingsError,
    } = useFetch(getDealerShipInfo);

    const {
        loading: savingHours,
        fn: saveWorkingHoursAction,
        data: saveResult,
        error: saveError,
    } = useFetch(saveWorkingHours);


    useEffect(() => {
        if (settingsData?.success && settingsData.data) {
          const dealership = settingsData.data;
    
          if (dealership.workingHours) {
            const mappedHours = DAYS.map((day) => {
              // Find matching working hour
              const hourData = dealership.workingHours.find(
                (h : WorkingHour) => h.dayOfWeek === day.value
              );
    
              if (hourData) {
                return {
                  dayOfWeek: hourData.dayOfWeek,
                  openTime: hourData.openTime,
                  closeTime: hourData.closeTime,
                  isOpen: hourData.isOpen,
                };
              }
    
              return {
                dayOfWeek: day.value,
                openTime: "09:00",
                closeTime: "18:00",
                isOpen: day.value !== "SUNDAY",
              };
            });
    
            setWorkingHours(mappedHours);
          }
        }
      }, [settingsData]);

    useEffect(() => {
        fetchDealershipInfo();
    }, []);

    const handleWorkingHourChange = (index: number, field: string, value: boolean | string) => {
        const updatedHours = [...workingHours];
        updatedHours[index] = {
            ...updatedHours[index],
            [field]: value,
        };
        setWorkingHours(updatedHours);
    };

    const handleSavingWorkingHours = async() => await saveWorkingHoursAction(workingHours)


    useEffect(() => {
        if (saveResult?.success) {
            toast.success(saveResult.message);
            fetchDealershipInfo();
        }
    }, [saveResult]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Working Hours</CardTitle>
                <CardDescription>
                    Set your dealership's working hours for each day of the week.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className='space-y-4'>
                    {
                        DAYS.map((day, index) => {
                            return (
                                <div
                                    key={day.value}
                                    className="grid grid-cols-12 gap-4 items-center py-3 px-4 rounded-lg hover:bg-slate-50"
                                >
                                    <div className="col-span-3 md:col-span-2">
                                        <div className="font-medium">{day.label}</div>
                                    </div>

                                    <div className="col-span-9 md:col-span-2 flex items-center">
                                        <Checkbox
                                            id={`is-open-${day.value}`}
                                            checked={workingHours[index]?.isOpen}
                                            onCheckedChange={(checked) => {
                                                handleWorkingHourChange(index, "isOpen", checked);
                                            }}
                                        />
                                        <Label
                                            htmlFor={`is-open-${day.value}`}
                                            className="ml-2 cursor-pointer"
                                        >
                                            {workingHours[index]?.isOpen ? "Open" : "Closed"}
                                        </Label>
                                    </div>

                                    {
                                        workingHours[index]?.isOpen && (
                                            <>
                                                <div className="col-span-5 md:col-span-4">
                                                    <div className="flex items-center">
                                                        <Clock className="size-4 text-gray-400 mr-2" />
                                                        <Input
                                                            type="time"
                                                            value={workingHours[index]?.openTime}
                                                            onChange={(e) =>
                                                                handleWorkingHourChange(
                                                                    index,
                                                                    "openTime",
                                                                    e.target.value
                                                                )
                                                            }
                                                            className="text-sm"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="text-center col-span-1">to</div>

                                                <div className="col-span-5 md:col-span-3">
                                                    <Input
                                                        type="time"
                                                        value={workingHours[index]?.closeTime}
                                                        onChange={(e) =>
                                                            handleWorkingHourChange(
                                                                index,
                                                                "closeTime",
                                                                e.target.value
                                                            )
                                                        }
                                                        className="text-sm"
                                                    />
                                                </div>
                                            </>
                                        )
                                    }

                                    {!workingHours[index]?.isOpen && (
                                        <div className="col-span-11 md:col-span-8 text-gray-500 italic text-sm">
                                            Closed all day
                                        </div>
                                    )}
                                </div>
                            )
                        })
                    }


                </div>

                <div className= "flex justify-end">
                <Button 
                    onClick = {handleSavingWorkingHours}
                    disabled={savingWorkingHours as boolean}
                >
                       {savingHours ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 size-4" />
                      Save Working Hours
                    </>
                  )}
                </Button>

                </div>
            </CardContent>
        </Card>
    )
}

export default WorkingHoursForm