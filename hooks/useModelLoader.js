import { useState, useEffect } from 'react';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';

export const useModelLoader = (modelPath) => {
  const [modelUri, setModelUri] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadModel() {
      try {
        const asset = Asset.fromModule(modelPath);
        await asset.downloadAsync();
        
        // Create a local copy in FileSystem
        const localUri = `${FileSystem.documentDirectory}model.glb`;
        await FileSystem.copyAsync({
          from: asset.uri,
          to: localUri
        });
        
        setModelUri(localUri);
      } catch (err) {
        setError(err);
        console.error('Error loading model:', err);
      }
    }

    loadModel();
  }, [modelPath]);

  return { modelUri, error };
}; 