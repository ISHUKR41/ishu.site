
-- ===== TIMESTAMP TRIGGER FUNCTION =====
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- ===== USER ROLES =====
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Admins can manage roles" ON public.user_roles
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view own roles" ON public.user_roles
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- ===== PROFILES =====
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  whatsapp_number TEXT,
  whatsapp_subscribed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ===== CATEGORIES =====
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL CHECK (type IN ('result', 'news', 'blog')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Categories viewable by everyone" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Admins can manage categories" ON public.categories FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- ===== RESULTS (Government forms/vacancies) =====
CREATE TABLE public.results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  organization TEXT,
  level TEXT NOT NULL DEFAULT 'central' CHECK (level IN ('central', 'state')),
  state TEXT,
  type TEXT NOT NULL DEFAULT 'result' CHECK (type IN ('result', 'admit_card', 'answer_key', 'syllabus', 'form', 'vacancy')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'upcoming', 'expired')),
  apply_link TEXT,
  official_link TEXT,
  start_date DATE,
  end_date DATE,
  exam_date DATE,
  age_limit TEXT,
  qualification TEXT,
  total_vacancies INTEGER,
  documents_required TEXT[],
  important_dates JSONB DEFAULT '{}',
  fees JSONB DEFAULT '{}',
  is_featured BOOLEAN DEFAULT false,
  category_id UUID REFERENCES public.categories(id),
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.results ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Results viewable by everyone" ON public.results FOR SELECT USING (true);
CREATE POLICY "Admins can manage results" ON public.results FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_results_updated_at BEFORE UPDATE ON public.results
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_results_level ON public.results(level);
CREATE INDEX idx_results_state ON public.results(state);
CREATE INDEX idx_results_type ON public.results(type);
CREATE INDEX idx_results_status ON public.results(status);

-- ===== NEWS =====
CREATE TABLE public.news (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT,
  summary TEXT,
  image_url TEXT,
  source TEXT,
  source_url TEXT,
  category TEXT NOT NULL DEFAULT 'general',
  tags TEXT[],
  language TEXT DEFAULT 'en',
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT true,
  views INTEGER DEFAULT 0,
  created_by UUID REFERENCES auth.users(id),
  published_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published news viewable by everyone" ON public.news FOR SELECT USING (is_published = true);
CREATE POLICY "Admins can manage news" ON public.news FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_news_updated_at BEFORE UPDATE ON public.news
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_news_category ON public.news(category);
CREATE INDEX idx_news_published_at ON public.news(published_at DESC);

-- ===== BLOG POSTS =====
CREATE TABLE public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT,
  excerpt TEXT,
  cover_image TEXT,
  author_id UUID REFERENCES auth.users(id),
  category TEXT DEFAULT 'general',
  tags TEXT[],
  is_published BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  views INTEGER DEFAULT 0,
  read_time INTEGER DEFAULT 5,
  meta_title TEXT,
  meta_description TEXT,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published posts viewable by everyone" ON public.blog_posts FOR SELECT USING (is_published = true);
CREATE POLICY "Admins can manage posts" ON public.blog_posts FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ===== CONTACTS =====
CREATE TABLE public.contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit contact" ON public.contacts FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view contacts" ON public.contacts FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update contacts" ON public.contacts FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- ===== WHATSAPP SUBSCRIBERS =====
CREATE TABLE public.whatsapp_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone TEXT NOT NULL UNIQUE,
  name TEXT,
  subscribed_categories TEXT[] DEFAULT ARRAY['all'],
  is_active BOOLEAN DEFAULT true,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.whatsapp_subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can subscribe" ON public.whatsapp_subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can manage subscribers" ON public.whatsapp_subscribers FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));
