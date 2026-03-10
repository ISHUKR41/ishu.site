
-- Fix permissive INSERT policies by adding rate-limit-friendly constraints
-- contacts: keep open but add a note - this is intentional for contact forms
DROP POLICY IF EXISTS "Anyone can submit contact" ON public.contacts;
CREATE POLICY "Anyone can submit contact" ON public.contacts 
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    length(name) > 0 AND length(email) > 3 AND length(message) > 0
  );

-- whatsapp_subscribers: require valid phone
DROP POLICY IF EXISTS "Anyone can subscribe" ON public.whatsapp_subscribers;
CREATE POLICY "Anyone can subscribe" ON public.whatsapp_subscribers 
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    length(phone) >= 10
  );
