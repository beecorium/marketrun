CREATE TABLE `admin_settings` (
	`id` integer PRIMARY KEY NOT NULL,
	`survey_url` text DEFAULT '' NOT NULL,
	`point3_answers` text DEFAULT '[]' NOT NULL,
	`benefits` text DEFAULT '[]' NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
