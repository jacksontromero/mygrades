import { bucket, serverDataStore } from "@/data/store";
import { relations, sql } from "drizzle-orm";
import {
  index,
  integer,
  jsonb,
  pgMaterializedView,
  pgTableCreator,
  primaryKey,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { type AdapterAccount } from "next-auth/adapters";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `mygrades_${name}`);

// export const posts = createTable(
//   "post",
//   {
//     id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
//     name: varchar("name", { length: 256 }),
//     createdById: varchar("created_by", { length: 255 })
//       .notNull()
//       .references(() => users.id),
//     createdAt: timestamp("created_at", { withTimezone: true })
//       .default(sql`CURRENT_TIMESTAMP`)
//       .notNull(),
//     updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
//       () => new Date()
//     ),
//   },
//   (example) => ({
//     createdByIdIdx: index("created_by_idx").on(example.createdById),
//     nameIndex: index("name_idx").on(example.name),
//   })
// );

export const savedStores = createTable("saved_store", {
  createdById: varchar("created_by", { length: 255 })
    .notNull()
    .primaryKey()
    .references(() => users.id),

  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
    () => new Date(),
  ),

  data: jsonb("data").$type<serverDataStore>().notNull(),
});

// NOTE - requires enabling pg_trgm and btree_gin extensions on the DB manually
export const publishedClasses = createTable(
  "published_class",
  {
    id: varchar("id", { length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    createdById: varchar("created_by", { length: 255 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),

    name: varchar("name", { length: 255 }).notNull(),
    number: varchar("number", { length: 255 }).notNull(),
    weights: jsonb("weights").$type<bucket[]>().notNull(),

    university: varchar("university", { length: 255 }).notNull(),
    semester: varchar("semester", { length: 255 }),

    numUsers: integer("num_users").notNull().default(0),
    numInaccurateReports: integer("num_inaccurate_reports")
      .notNull()
      .default(0),
  },
  (example) => ({
    courseNameSearchIdx: index("name_search_idx").using("gin", example.name),
    courseNumberSearchIdx: index("number__search_idx").using(
      "gin",
      example.number,
    ),
  }),
);

export const publishedClassesRelations = relations(
  publishedClasses,
  ({ many }) => ({
    usersToInaccurateReports: many(usersToInaccurateReports),
  }),
);

export const allUniversitiesView = pgMaterializedView("mygrades_all_unis").as(
  (qb) =>
    qb
      .selectDistinct({ university: publishedClasses.university })
      .from(publishedClasses),
);

export const usersToInaccurateReports = createTable(
  "users_to_inacc_reports",
  {
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id),

    classId: varchar("class_id", { length: 255 })
      .notNull()
      .references(() => publishedClasses.id),
  },
  (example) => ({
    pk: primaryKey({ columns: [example.userId, example.classId] }),
  }),
);

export const usersToInaccurateReportsRelations = relations(
  usersToInaccurateReports,
  ({ one }) => ({
    user: one(users, {
      fields: [usersToInaccurateReports.userId],
      references: [users.id],
    }),
    class: one(publishedClasses, {
      fields: [usersToInaccurateReports.classId],
      references: [publishedClasses.id],
    }),
  }),
);

export const users = createTable("user", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  emailVerified: timestamp("email_verified", {
    mode: "date",
    withTimezone: true,
  }).default(sql`CURRENT_TIMESTAMP`),
  image: varchar("image", { length: 255 }),
});

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  usersToInaccurateReports: many(usersToInaccurateReports),
}));

export const accounts = createTable(
  "account",
  {
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id),
    type: varchar("type", { length: 255 })
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("provider_account_id", {
      length: 255,
    }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
    userIdIdx: index("account_user_id_idx").on(account.userId),
  }),
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = createTable(
  "session",
  {
    sessionToken: varchar("session_token", { length: 255 })
      .notNull()
      .primaryKey(),
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id),
    expires: timestamp("expires", {
      mode: "date",
      withTimezone: true,
    }).notNull(),
  },
  (session) => ({
    userIdIdx: index("session_user_id_idx").on(session.userId),
  }),
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = createTable(
  "verification_token",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", {
      mode: "date",
      withTimezone: true,
    }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  }),
);
