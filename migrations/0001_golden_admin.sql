ALTER TABLE admin_settings ADD COLUMN mission1_answers TEXT NOT NULL DEFAULT '["패","랭","이"]';
ALTER TABLE admin_settings ADD COLUMN mission2_code TEXT NOT NULL DEFAULT '251';
ALTER TABLE admin_settings ADD COLUMN mission3_answers TEXT NOT NULL DEFAULT '["황금송","황금소나무","소나무"]';

UPDATE admin_settings
SET survey_url = CASE
  WHEN trim(survey_url) = '' THEN 'https://naver.me/5T0ElUPI'
  ELSE survey_url
END
WHERE id = 1;
