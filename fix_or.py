import re
filepath = "client/src/features/games/ObjectRecognition/ObjectRecognition.tsx"
with open(filepath, "r", encoding="utf-8") as f:
    c = f.read()

c = c.replace("import React,\nimport { useTranslation } from 'react-i18next';\n { useState, useEffect, useCallback } from 'react';", "import React, { useState, useEffect, useCallback } from 'react';\nimport { useTranslation } from 'react-i18next';")

with open(filepath, "w", encoding="utf-8") as f:
    f.write(c)
