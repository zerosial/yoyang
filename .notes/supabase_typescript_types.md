export type Json =
| string
| number
| boolean
| null
| { [key: string]: Json | undefined }
| Json[]

export type Database = {
public: {
Tables: {
attendance: {
Row: {
checked*at: string
created_at: string | null
id: string
latitude: number | null
longitude: number | null
schedule_id: string | null
type: string
worker_id: string | null
}
Insert: {
checked_at: string
created_at?: string | null
id?: string
latitude?: number | null
longitude?: number | null
schedule_id?: string | null
type: string
worker_id?: string | null
}
Update: {
checked_at?: string
created_at?: string | null
id?: string
latitude?: number | null
longitude?: number | null
schedule_id?: string | null
type?: string
worker_id?: string | null
}
Relationships: [
{
foreignKeyName: "attendance_schedule_id_fkey"
columns: ["schedule_id"]
isOneToOne: false
referencedRelation: "schedules"
referencedColumns: ["id"]
},
{
foreignKeyName: "attendance_worker_id_fkey"
columns: ["worker_id"]
isOneToOne: false
referencedRelation: "users"
referencedColumns: ["id"]
},
]
}
care_notes: {
Row: {
created_at: string | null
id: string
note: string
patient_id: string | null
schedule_id: string | null
worker_id: string | null
}
Insert: {
created_at?: string | null
id?: string
note: string
patient_id?: string | null
schedule_id?: string | null
worker_id?: string | null
}
Update: {
created_at?: string | null
id?: string
note?: string
patient_id?: string | null
schedule_id?: string | null
worker_id?: string | null
}
Relationships: [
{
foreignKeyName: "care_notes_patient_id_fkey"
columns: ["patient_id"]
isOneToOne: false
referencedRelation: "patients"
referencedColumns: ["id"]
},
{
foreignKeyName: "care_notes_schedule_id_fkey"
columns: ["schedule_id"]
isOneToOne: false
referencedRelation: "schedules"
referencedColumns: ["id"]
},
{
foreignKeyName: "care_notes_worker_id_fkey"
columns: ["worker_id"]
isOneToOne: false
referencedRelation: "users"
referencedColumns: ["id"]
},
]
}
location_logs: {
Row: {
created_at: string | null
id: string
latitude: number
logged_at: string
longitude: number
schedule_id: string | null
worker_id: string | null
}
Insert: {
created_at?: string | null
id?: string
latitude: number
logged_at: string
longitude: number
schedule_id?: string | null
worker_id?: string | null
}
Update: {
created_at?: string | null
id?: string
latitude?: number
logged_at?: string
longitude?: number
schedule_id?: string | null
worker_id?: string | null
}
Relationships: [
{
foreignKeyName: "location_logs_schedule_id_fkey"
columns: ["schedule_id"]
isOneToOne: false
referencedRelation: "schedules"
referencedColumns: ["id"]
},
{
foreignKeyName: "location_logs_worker_id_fkey"
columns: ["worker_id"]
isOneToOne: false
referencedRelation: "users"
referencedColumns: ["id"]
},
]
}
notifications: {
Row: {
created_at: string | null
id: string
is_read: boolean | null
message: string
type: string | null
user_id: string | null
}
Insert: {
created_at?: string | null
id?: string
is_read?: boolean | null
message: string
type?: string | null
user_id?: string | null
}
Update: {
created_at?: string | null
id?: string
is_read?: boolean | null
message?: string
type?: string | null
user_id?: string | null
}
Relationships: [
{
foreignKeyName: "notifications_user_id_fkey"
columns: ["user_id"]
isOneToOne: false
referencedRelation: "users"
referencedColumns: ["id"]
},
]
}
patients: {
Row: {
address: string | null
birthdate: string | null
created_at: string | null
gender: string | null
id: string
name: string
phone: string | null
updated_at: string | null
}
Insert: {
address?: string | null
birthdate?: string | null
created_at?: string | null
gender?: string | null
id?: string
name: string
phone?: string | null
updated_at?: string | null
}
Update: {
address?: string | null
birthdate?: string | null
created_at?: string | null
gender?: string | null
id?: string
name?: string
phone?: string | null
updated_at?: string | null
}
Relationships: []
}
schedules: {
Row: {
created_at: string | null
end_time: string | null
id: string
location: string | null
patient_id: string | null
scheduled_date: string
start_time: string | null
status: string | null
updated_at: string | null
worker_id: string | null
}
Insert: {
created_at?: string | null
end_time?: string | null
id?: string
location?: string | null
patient_id?: string | null
scheduled_date: string
start_time?: string | null
status?: string | null
updated_at?: string | null
worker_id?: string | null
}
Update: {
created_at?: string | null
end_time?: string | null
id?: string
location?: string | null
patient_id?: string | null
scheduled_date?: string
start_time?: string | null
status?: string | null
updated_at?: string | null
worker_id?: string | null
}
Relationships: [
{
foreignKeyName: "schedules_patient_id_fkey"
columns: ["patient_id"]
isOneToOne: false
referencedRelation: "patients"
referencedColumns: ["id"]
},
{
foreignKeyName: "schedules_worker_id_fkey"
columns: ["worker_id"]
isOneToOne: false
referencedRelation: "users"
referencedColumns: ["id"]
},
]
}
users: {
Row: {
created_at: string | null
email: string
id: string
name: string
password: string | null
phone: string | null
role: string
updated_at: string | null
}
Insert: {
created_at?: string | null
email: string
id?: string
name: string
password?: string | null
phone?: string | null
role: string
updated_at?: string | null
}
Update: {
created_at?: string | null
email?: string
id?: string
name?: string
password?: string | null
phone?: string | null
role?: string
updated_at?: string | null
}
Relationships: []
}
}
Views: {
[* in never]: never
}
Functions: {
[_ in never]: never
}
Enums: {
[_ in never]: never
}
CompositeTypes: {
[_ in never]: never
}
}
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
DefaultSchemaTableNameOrOptions extends
| keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
| { schema: keyof Database },
TableName extends DefaultSchemaTableNameOrOptions extends {
schema: keyof Database
}
? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
: never = never,

> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
> ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &

      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never

: DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
DefaultSchema["Views"])
? (DefaultSchema["Tables"] &
DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
Row: infer R
}
? R
: never
: never

export type TablesInsert<
DefaultSchemaTableNameOrOptions extends
| keyof DefaultSchema["Tables"]
| { schema: keyof Database },
TableName extends DefaultSchemaTableNameOrOptions extends {
schema: keyof Database
}
? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
: never = never,

> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
> ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {

      Insert: infer I
    }
    ? I
    : never

: DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
Insert: infer I
}
? I
: never
: never

export type TablesUpdate<
DefaultSchemaTableNameOrOptions extends
| keyof DefaultSchema["Tables"]
| { schema: keyof Database },
TableName extends DefaultSchemaTableNameOrOptions extends {
schema: keyof Database
}
? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
: never = never,

> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
> ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {

      Update: infer U
    }
    ? U
    : never

: DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
Update: infer U
}
? U
: never
: never

export type Enums<
DefaultSchemaEnumNameOrOptions extends
| keyof DefaultSchema["Enums"]
| { schema: keyof Database },
EnumName extends DefaultSchemaEnumNameOrOptions extends {
schema: keyof Database
}
? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
: never = never,

> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
> ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
> : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]

    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
PublicCompositeTypeNameOrOptions extends
| keyof DefaultSchema["CompositeTypes"]
| { schema: keyof Database },
CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
schema: keyof Database
}
? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
: never = never,

> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
> ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
> : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]

    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
public: {
Enums: {},
},
} as const
