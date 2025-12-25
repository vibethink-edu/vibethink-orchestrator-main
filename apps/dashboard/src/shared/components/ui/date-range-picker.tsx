'use client'

import * as React from 'react'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { DateRange } from 'react-day-picker'
import { cn } from '@/shared/lib/utils'
import { Button } from '@vibethink/ui/components/button'
import { Calendar } from '@vibethink/ui/components/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@vibethink/ui/components/popover'

interface DatePickerWithRangeProps {
    from?: Date
    to?: Date
    onDateChange?: (range: DateRange | undefined) => void
    className?: string
    placeholder?: string
}

/**
 * Date Range Picker Component
 * 
 * A date range picker component built with shadcn/ui components
 * Supports date range selection with proper validation
 */
export function DatePickerWithRange({
    from,
    to,
    onDateChange,
    className,
    placeholder = 'Pick a date range'
}: DatePickerWithRangeProps) {
    const [date, setDate] = React.useState<DateRange | undefined>({
        from,
        to
    })

    React.useEffect(() => {
        setDate({ from, to })
    }, [from, to])

    const handleDateSelect = (range: DateRange | undefined) => {
        setDate(range)
        onDateChange?.(range)
    }

    return (
        <div className={cn('grid gap-2', className)}>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant="outline"
                        className={cn(
                            'w-[280px] justify-start text-left font-normal',
                            !date && 'text-muted-foreground'
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date?.from ? (
                            date.to ? (
                                <>
                                    {format(date.from, "dd MMM yyyy")} - {format(date.to, "dd MMM yyyy")}
                                </>
                            ) : (
                                format(date.from, "dd MMM yyyy")
                            )
                        ) : (
                            <span>{placeholder}</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={date?.from}
                        selected={date}
                        onSelect={handleDateSelect}
                        numberOfMonths={2}
                    />
                </PopoverContent>
            </Popover>
        </div>
    )
}
