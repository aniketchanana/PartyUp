"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Calendar, Type, User, AlertCircle } from "lucide-react";

export interface InviteFormValues {
  location: string;
  dateTime: string;
  heading: string;
  hostName: string;
}

interface FieldErrors {
  heading?: string;
  hostName?: string;
  location?: string;
  dateTime?: string;
}

function validate(values: InviteFormValues): FieldErrors {
  const errors: FieldErrors = {};

  if (!values.heading.trim()) {
    errors.heading = "Party heading is required";
  } else if (values.heading.trim().length < 3) {
    errors.heading = "Heading must be at least 3 characters";
  }

  if (!values.hostName.trim()) {
    errors.hostName = "Host name is required";
  }

  if (!values.location.trim()) {
    errors.location = "Location is required";
  }

  if (!values.dateTime) {
    errors.dateTime = "Date and time are required";
  } else {
    const parsed = new Date(values.dateTime);
    if (isNaN(parsed.getTime())) {
      errors.dateTime = "Please enter a valid date and time";
    } else if (parsed <= new Date()) {
      errors.dateTime = "Date must be in the future";
    }
  }

  return errors;
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="flex items-center gap-1 text-sm text-destructive mt-1">
      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
      {message}
    </p>
  );
}

export function InviteForm({
  values,
  onChange,
  onNext,
}: {
  values: InviteFormValues;
  onChange: (v: InviteFormValues) => void;
  onNext: () => void;
}) {
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  function handleBlur(field: keyof InviteFormValues) {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const fieldErrors = validate(values);
    setErrors((prev) => ({ ...prev, [field]: fieldErrors[field] }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const fieldErrors = validate(values);
    setErrors(fieldErrors);
    setTouched({ heading: true, hostName: true, location: true, dateTime: true });

    if (Object.keys(fieldErrors).length === 0) {
      onNext();
    }
  }

  const now = new Date();
  const minDateTime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}T${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-heading text-xl">Invite Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <div className="space-y-2">
            <Label htmlFor="heading" className="flex items-center gap-2">
              <Type className="h-4 w-4 text-primary" />
              Party Heading / One-liner
            </Label>
            <Input
              id="heading"
              placeholder="You're invited to Sarah's 30th!"
              value={values.heading}
              onChange={(e) =>
                onChange({ ...values, heading: e.target.value })
              }
              onBlur={() => handleBlur("heading")}
              aria-invalid={!!(touched.heading && errors.heading)}
            />
            {touched.heading && <FieldError message={errors.heading} />}
          </div>

          <div className="space-y-2">
            <Label htmlFor="hostName" className="flex items-center gap-2">
              <User className="h-4 w-4 text-primary" />
              Host / Organizer Name
            </Label>
            <Input
              id="hostName"
              placeholder="Sarah & Mike"
              value={values.hostName}
              onChange={(e) =>
                onChange({ ...values, hostName: e.target.value })
              }
              onBlur={() => handleBlur("hostName")}
              aria-invalid={!!(touched.hostName && errors.hostName)}
            />
            {touched.hostName && <FieldError message={errors.hostName} />}
          </div>

          <div className="space-y-2">
            <Label htmlFor="location" className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              Location
            </Label>
            <Input
              id="location"
              placeholder="The Grand Ballroom, 123 Main St"
              value={values.location}
              onChange={(e) =>
                onChange({ ...values, location: e.target.value })
              }
              onBlur={() => handleBlur("location")}
              aria-invalid={!!(touched.location && errors.location)}
            />
            {touched.location && <FieldError message={errors.location} />}
          </div>

          <div className="space-y-2">
            <Label htmlFor="dateTime" className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              Date and Time
            </Label>
            <Input
              id="dateTime"
              type="datetime-local"
              min={minDateTime}
              value={values.dateTime}
              onChange={(e) =>
                onChange({ ...values, dateTime: e.target.value })
              }
              onBlur={() => handleBlur("dateTime")}
              aria-invalid={!!(touched.dateTime && errors.dateTime)}
            />
            {touched.dateTime && <FieldError message={errors.dateTime} />}
          </div>

          <Button
            type="submit"
            className="w-full party-gradient text-white font-semibold"
          >
            Next: Choose Template
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
