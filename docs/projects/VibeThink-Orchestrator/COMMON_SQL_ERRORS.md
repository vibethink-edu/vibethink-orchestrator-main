# Common SQL Errors & Solutions

## 🚨 **Error 42P17: Functions in Index Predicate Must Be Marked IMMUTABLE**

### **Error Message:**
```sql
ERROR: 42P17: functions in index predicate must be marked IMMUTABLE
```

### **Root Cause:**
PostgreSQL requires functions used in **partial index predicates** to be marked as `IMMUTABLE`. Functions that return different values on each call (like `now()`, `random()`) cannot be used in index definitions.

### **Problematic Code:**
```sql
-- ❌ CAUSES ERROR
CREATE INDEX idx_recent_logs ON logs(created_at DESC) 
WHERE created_at > now() - interval '30 days';
```

### **Solution:**
```sql
-- ✅ WORKING SOLUTION
CREATE INDEX idx_logs_created_at ON logs(created_at DESC);
CREATE INDEX idx_logs_user_time ON logs(user_id, created_at DESC);
```

### **Alternative Solutions:**
```sql
-- ✅ Option 1: Use fixed date
CREATE INDEX idx_logs_2024 ON logs(created_at DESC) 
WHERE created_at > '2024-01-01'::timestamp;

-- ✅ Option 2: Create immutable function
CREATE OR REPLACE FUNCTION get_cutoff_date()
RETURNS timestamp
LANGUAGE sql
IMMUTABLE
AS $$ SELECT '2024-01-01'::timestamp; $$;

CREATE INDEX idx_logs_recent ON logs(created_at DESC) 
WHERE created_at > get_cutoff_date();
```

---

## 🚨 **Error 42703: Column Does Not Exist**

### **Error Message:**
```sql
ERROR: 42703: column "column_name" does not exist
```

### **Root Cause:**
Referencing a column that doesn't exist in the table or using wrong column name.

### **Solution:**
```sql
-- Check existing columns
\d table_name

-- Or query information schema
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'your_table';
```

---

## 🚨 **Error 23505: Unique Violation**

### **Error Message:**
```sql
ERROR: 23505: duplicate key value violates unique constraint
```

### **Root Cause:**
Trying to insert a duplicate value in a column with unique constraint.

### **Solution:**
```sql
-- Use ON CONFLICT for upsert
INSERT INTO table_name (id, name) 
VALUES (1, 'test') 
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- Or check for existing data
SELECT COUNT(*) FROM table_name WHERE id = 1;
```

---

## 🚨 **Error 23503: Foreign Key Violation**

### **Error Message:**
```sql
ERROR: 23503: insert or update on table violates foreign key constraint
```

### **Root Cause:**
Referencing a non-existent foreign key value.

### **Solution:**
```sql
-- Check if referenced value exists
SELECT id FROM parent_table WHERE id = referenced_id;

-- Use CASCADE or SET NULL in foreign key definition
FOREIGN KEY (parent_id) REFERENCES parent_table(id) ON DELETE CASCADE
```

---

## 🚨 **Error 42P01: Relation Does Not Exist**

### **Error Message:**
```sql
ERROR: 42P01: relation "table_name" does not exist
```

### **Root Cause:**
Table doesn't exist or wrong schema reference.

### **Solution:**
```sql
-- Check if table exists
\dt table_name

-- Or query information schema
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';
```

---

## 🚨 **Error 42883: Function Does Not Exist**

### **Error Message:**
```sql
ERROR: 42883: function function_name() does not exist
```

### **Root Cause:**
Function not created or wrong parameters.

### **Solution:**
```sql
-- Check existing functions
\df function_name

-- Or query information schema
SELECT routine_name, routine_definition 
FROM information_schema.routines 
WHERE routine_name = 'function_name';
```

---

## 🚨 **Error 42501: Insufficient Privilege**

### **Error Message:**
```sql
ERROR: 42501: permission denied for table table_name
```

### **Root Cause:**
User doesn't have required permissions.

### **Solution:**
```sql
-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON table_name TO user_name;

-- Or use RLS policies
CREATE POLICY "policy_name" ON table_name FOR ALL USING (condition);
```

---

## 🚨 **Error 42601: Syntax Error**

### **Error Message:**
```sql
ERROR: 42601: syntax error at or near "token"
```

### **Root Cause:**
SQL syntax error, usually missing semicolon or wrong keyword.

### **Common Fixes:**
```sql
-- Missing semicolon
CREATE TABLE test (id int);  -- ✅ Add semicolon

-- Wrong keyword
CREATE TABLE test (id INTEGER);  -- ✅ Use correct data type

-- Missing parentheses
CREATE FUNCTION test() RETURNS void AS $$ ... $$;  -- ✅ Add $$
```

---

## 🚨 **Error 22007: Invalid Datetime Format**

### **Error Message:**
```sql
ERROR: 22007: invalid input syntax for type timestamp
```

### **Root Cause:**
Wrong date/time format.

### **Solution:**
```sql
-- Use proper format
INSERT INTO table_name (created_at) VALUES ('2024-01-01 10:00:00');

-- Or use casting
INSERT INTO table_name (created_at) VALUES ('2024-01-01'::timestamp);
```

---

## 🚨 **Error 22P02: Invalid Text Representation**

### **Error Message:**
```sql
ERROR: 22P02: invalid input syntax for type uuid
```

### **Root Cause:**
Invalid UUID format.

### **Solution:**
```sql
-- Use proper UUID format
INSERT INTO table_name (id) VALUES ('123e4567-e89b-12d3-a456-426614174000');

-- Or generate UUID
INSERT INTO table_name (id) VALUES (gen_random_uuid());
```

---

## 🚨 **Error 23514: Check Violation**

### **Error Message:**
```sql
ERROR: 23514: new row for relation violates check constraint
```

### **Root Cause:**
Data violates CHECK constraint.

### **Solution:**
```sql
-- Check constraint definition
SELECT conname, pg_get_constraintdef(oid) 
FROM pg_constraint 
WHERE conrelid = 'table_name'::regclass;

-- Ensure data meets constraint
INSERT INTO table_name (value) VALUES (valid_value);
```

---

## 🔧 **Debugging Tools**

### **1. Check Table Structure:**
```sql
\d table_name
```

### **2. Check Indexes:**
```sql
\di table_name
```

### **3. Check Functions:**
```sql
\df function_name
```

### **4. Check Policies:**
```sql
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'table_name';
```

### **5. Check Constraints:**
```sql
SELECT conname, contype, pg_get_constraintdef(oid) 
FROM pg_constraint 
WHERE conrelid = 'table_name'::regclass;
```

---

## 📋 **Migration Checklist**

### **Before Migration:**
- [ ] Check for non-immutable functions in indexes
- [ ] Verify all referenced tables exist
- [ ] Check foreign key references
- [ ] Test in development environment
- [ ] Backup production data

### **After Migration:**
- [ ] Verify all tables created
- [ ] Check all indexes created
- [ ] Test all functions
- [ ] Verify RLS policies
- [ ] Test application functionality

---

## 🎯 **Best Practices**

### **1. Always Use Explicit Types:**
```sql
-- ✅ Good
CREATE TABLE test (id INTEGER, name TEXT);

-- ❌ Avoid
CREATE TABLE test (id int, name varchar);
```

### **2. Use Proper Constraints:**
```sql
-- ✅ Good
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

### **3. Use Proper Indexes:**
```sql
-- ✅ Good
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at DESC);
```

### **4. Use Proper RLS:**
```sql
-- ✅ Good
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own data" ON users FOR SELECT USING (auth.uid() = id);
```

---

**📝 Note:** This document should be updated whenever new SQL errors are encountered to maintain a comprehensive troubleshooting guide. 