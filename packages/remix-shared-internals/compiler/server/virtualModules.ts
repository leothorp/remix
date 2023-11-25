interface VirtualModule {
  id: string;
  filter: RegExp;
}

export const serverBuildVirtualModule: VirtualModule = {
  id: "@remix-run/shared-internals/server-build",
  filter: /^@remix-run\/dev\/server-build$/,
};

export const assetsManifestVirtualModule: VirtualModule = {
  id: "@remix-run/shared-internals/assets-manifest",
  filter: /^@remix-run\/dev\/assets-manifest$/,
};
