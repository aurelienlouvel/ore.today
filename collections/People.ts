import type { CollectionConfig } from "payload";

export const People: CollectionConfig = {
  slug: "people",
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "avatar",
      type: "upload",
      relationTo: "media",
      required: true,
    },
    {
      name: "firstName",
      type: "text",
      required: true,
    },
    {
      name: "lastName",
      type: "text",
      required: true,
    },
    {
      name: "linkedin",
      type: "text",
      required: true,
    },
  ],
};
