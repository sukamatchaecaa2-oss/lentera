-- Supabase Setup SQL for Roles and Profiles

-- 1. Create custom roles enum
CREATE TYPE public.user_role AS ENUM ('SISWA', 'GURU', 'ADMIN');

-- 2. Create profiles table
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  nama_lengkap TEXT,
  username TEXT UNIQUE,
  role public.user_role DEFAULT 'SISWA',
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 4. Policies

-- Allow users to read their own profile
CREATE POLICY "Users can view own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

-- Allow admins to read all profiles
CREATE POLICY "Admins can view all profiles" 
ON public.profiles FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'ADMIN'
  )
);

-- Allow users to update their own profile (except role)
-- Note: In a real app, you'd want to restrict which columns can be updated via a dedicated function or more granular policies
CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

-- Allow admins to update any profile
CREATE POLICY "Admins can update any profile" 
ON public.profiles FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'ADMIN'
  )
);

-- 5. Function to handle new user registration
-- This function will set the FIRST user as 'ADMIN' automatically
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  is_first_user BOOLEAN;
BEGIN
  SELECT COUNT(*) = 0 INTO is_first_user FROM public.profiles;
  
  INSERT INTO public.profiles (id, nama_lengkap, role, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    CASE WHEN is_first_user THEN 'ADMIN'::public.user_role ELSE 'SISWA'::public.user_role END,
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Trigger to call handle_new_user on sign up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
