
import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Box,
  Grid,
  Alert,
  Divider,
  Switch,
  FormControlLabel,
  Chip
} from '@mui/material';
import { Save, Visibility, VisibilityOff, ContentCopy, CheckCircle } from '@mui/icons-material';
import { toast } from 'sonner';

interface StripeConfig {
  publishableKey: string;
  secretKey: string;
  webhookSecret: string;
  testMode: boolean;
  priceId: string;
  productId: string;
}

const StripeConfigPage = () => {
  const [config, setConfig] = useState<StripeConfig>({
    publishableKey: '',
    secretKey: '',
    webhookSecret: '',
    testMode: true,
    priceId: '',
    productId: ''
  });
  
  const [showSecrets, setShowSecrets] = useState({
    secretKey: false,
    webhookSecret: false
  });
  
  const [copied, setCopied] = useState('');
  const [loading, setLoading] = useState(false);

  // URL do webhook que deve ser configurada no Stripe
  const webhookUrl = `https://erfuinkfouijxgfkxhhn.supabase.co/functions/v1/stripe-webhook`;

  const handleInputChange = (field: keyof StripeConfig) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = field === 'testMode' ? event.target.checked : event.target.value;
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const toggleSecretVisibility = (field: 'secretKey' | 'webhookSecret') => {
    setShowSecrets(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(label);
      toast.success(`${label} copiado para a área de transferência!`);
      setTimeout(() => setCopied(''), 2000);
    } catch (error) {
      toast.error('Erro ao copiar para a área de transferência');
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Aqui você salvaria as configurações - por enquanto apenas simulando
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Configurações do Stripe salvas com sucesso!');
    } catch (error) {
      toast.error('Erro ao salvar configurações');
    } finally {
      setLoading(false);
    }
  };

  const validateStripeKey = (key: string, type: 'publishable' | 'secret') => {
    if (!key) return false;
    
    if (type === 'publishable') {
      return key.startsWith('pk_');
    } else {
      return key.startsWith('sk_');
    }
  };

  return (
    <Container maxWidth="lg" className="py-8">
      <Typography variant="h4" gutterBottom className="dark:text-white">
        Configurações do Stripe
      </Typography>
      
      <Typography variant="body1" color="textSecondary" className="dark:text-gray-300 mb-6">
        Configure suas chaves e webhooks do Stripe para processar pagamentos
      </Typography>

      <Grid container spacing={4}>
        {/* Configurações Básicas */}
        <Grid item xs={12}>
          <Card className="dark:bg-gray-800">
            <CardContent>
              <Typography variant="h6" gutterBottom className="dark:text-white">
                Configurações Básicas
              </Typography>

              <Box mb={3}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={config.testMode}
                      onChange={handleInputChange('testMode')}
                      color="primary"
                    />
                  }
                  label={
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography className="dark:text-white">Modo de Teste</Typography>
                      <Chip 
                        label={config.testMode ? "TEST" : "LIVE"} 
                        size="small"
                        color={config.testMode ? "warning" : "success"}
                      />
                    </Box>
                  }
                />
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Chave Publicável (Publishable Key)"
                    value={config.publishableKey}
                    onChange={handleInputChange('publishableKey')}
                    placeholder={config.testMode ? "pk_test_..." : "pk_live_..."}
                    error={config.publishableKey !== '' && !validateStripeKey(config.publishableKey, 'publishable')}
                    helperText={
                      config.publishableKey !== '' && !validateStripeKey(config.publishableKey, 'publishable')
                        ? "Chave publicável inválida"
                        : "Esta chave é segura para usar no frontend"
                    }
                    className="dark:text-white"
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Chave Secreta (Secret Key)"
                    type={showSecrets.secretKey ? "text" : "password"}
                    value={config.secretKey}
                    onChange={handleInputChange('secretKey')}
                    placeholder={config.testMode ? "sk_test_..." : "sk_live_..."}
                    error={config.secretKey !== '' && !validateStripeKey(config.secretKey, 'secret')}
                    helperText={
                      config.secretKey !== '' && !validateStripeKey(config.secretKey, 'secret')
                        ? "Chave secreta inválida"
                        : "Mantenha esta chave segura e privada"
                    }
                    InputProps={{
                      endAdornment: (
                        <Button
                          size="small"
                          onClick={() => toggleSecretVisibility('secretKey')}
                        >
                          {showSecrets.secretKey ? <VisibilityOff /> : <Visibility />}
                        </Button>
                      )
                    }}
                    className="dark:text-white"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Configuração de Webhook */}
        <Grid xs={12}>
          <Card className="dark:bg-gray-800">
            <CardContent>
              <Typography variant="h6" gutterBottom className="dark:text-white">
                Configuração de Webhook
              </Typography>

              <Alert severity="info" className="mb-4">
                <Typography variant="body2">
                  <strong>Importante:</strong> Configure este endpoint no seu Dashboard do Stripe para receber eventos de pagamento.
                </Typography>
              </Alert>

              <Box mb={3}>
                <Typography variant="subtitle2" className="dark:text-white mb-2">
                  URL do Webhook:
                </Typography>
                <Box display="flex" alignItems="center" gap={2} className="bg-gray-100 dark:bg-gray-700 p-3 rounded">
                  <Typography 
                    variant="body2" 
                    className="font-mono flex-1 dark:text-white"
                    style={{ wordBreak: 'break-all' }}
                  >
                    {webhookUrl}
                  </Typography>
                  <Button
                    size="small"
                    onClick={() => copyToClipboard(webhookUrl, 'URL do Webhook')}
                    startIcon={copied === 'URL do Webhook' ? <CheckCircle /> : <ContentCopy />}
                    color={copied === 'URL do Webhook' ? 'success' : 'primary'}
                  >
                    {copied === 'URL do Webhook' ? 'Copiado!' : 'Copiar'}
                  </Button>
                </Box>
              </Box>

              <TextField
                fullWidth
                label="Webhook Secret"
                type={showSecrets.webhookSecret ? "text" : "password"}
                value={config.webhookSecret}
                onChange={handleInputChange('webhookSecret')}
                placeholder="whsec_..."
                helperText="Secret do webhook fornecido pelo Stripe para validar requisições"
                InputProps={{
                  endAdornment: (
                    <Button
                      size="small"
                      onClick={() => toggleSecretVisibility('webhookSecret')}
                    >
                      {showSecrets.webhookSecret ? <VisibilityOff /> : <Visibility />}
                    </Button>
                  )
                }}
                className="dark:text-white"
              />

              <Box mt={3}>
                <Typography variant="subtitle2" className="dark:text-white mb-2">
                  Eventos necessários no Stripe:
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {[
                    'customer.subscription.created',
                    'customer.subscription.updated',
                    'customer.subscription.deleted',
                    'payment_intent.succeeded',
                    'payment_intent.payment_failed'
                  ].map((event) => (
                    <Chip key={event} label={event} size="small" variant="outlined" />
                  ))}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Produtos e Preços */}
        <Grid xs={12}>
          <Card className="dark:bg-gray-800">
            <CardContent>
              <Typography variant="h6" gutterBottom className="dark:text-white">
                Produtos e Preços
              </Typography>

              <Grid container spacing={3}>
                <Grid xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Product ID"
                    value={config.productId}
                    onChange={handleInputChange('productId')}
                    placeholder="prod_..."
                    helperText="ID do produto criado no Stripe"
                    className="dark:text-white"
                  />
                </Grid>

                <Grid xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Price ID"
                    value={config.priceId}
                    onChange={handleInputChange('priceId')}
                    placeholder="price_..."
                    helperText="ID do preço/plano de assinatura no Stripe"
                    className="dark:text-white"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Links Úteis */}
        <Grid xs={12}>
          <Card className="dark:bg-gray-800">
            <CardContent>
              <Typography variant="h6" gutterBottom className="dark:text-white">
                Links Úteis
              </Typography>

              <Grid container spacing={2}>
                <Grid xs={12} sm={6} md={3}>
                  <Button
                    fullWidth
                    variant="outlined"
                    href="https://dashboard.stripe.com/apikeys"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Chaves da API
                  </Button>
                </Grid>
                <Grid xs={12} sm={6} md={3}>
                  <Button
                    fullWidth
                    variant="outlined"
                    href="https://dashboard.stripe.com/webhooks"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Webhooks
                  </Button>
                </Grid>
                <Grid xs={12} sm={6} md={3}>
                  <Button
                    fullWidth
                    variant="outlined"
                    href="https://dashboard.stripe.com/products"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Produtos
                  </Button>
                </Grid>
                <Grid xs={12} sm={6} md={3}>
                  <Button
                    fullWidth
                    variant="outlined"
                    href="https://dashboard.stripe.com/test/logs"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Logs
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Botão Salvar */}
      <Box mt={4} display="flex" justifyContent="flex-end">
        <Button
          variant="contained"
          size="large"
          onClick={handleSave}
          disabled={loading}
          startIcon={<Save />}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {loading ? 'Salvando...' : 'Salvar Configurações'}
        </Button>
      </Box>
    </Container>
  );
};

export default StripeConfigPage;
